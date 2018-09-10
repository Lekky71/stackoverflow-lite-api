window.addEventListener('load', (ev) => {
  const searchText = getCookie('search_input');
  document.getElementById('search-input').value = searchText;
  getData(`/questions/search?query=${searchText}`, (err, res) => {
    if (res.status === 'success') {
      saveCookie('token', res.token);
      const questions = res.questions;
      const homeContainer = document.getElementById('questions-container');

      questions.forEach((question) => {
        homeContainer.innerHTML += `<div class="question-row">
    <div class="col-2 info">
      <div class="brief-info" style="">
        <div class="counts"><span title="0 answers">${question.answer_count}</span></div>
        <div>Answers</div>
      </div>
    </div>
    <div class="col-8 summary" style="text-align: left">
      <h2><a onclick="moveToQuestionPage('${question.question_id}')" href="#" style="font-size: 18px;" class="question-anchor">${question.title}</a></h2>
      <div class="tags">
        <h4>${question.category}</h4>
      </div>
      <div></div>
    </div>
  </div>`;
      });
    }
  });
});
