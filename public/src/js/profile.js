window.addEventListener('load', (ev) => {
  getData('/questions/my-questions', (err, res) => {
    if (!err) {
      if (res.status === 'success') {
        saveCookie('token', res.token);
        const user = getSavedUser();

        let popQues = res.questions;
        let rcntQues = res.questions;

        const popQuestionContainer = document.getElementById('popular-questions-container');
        const recentQuestionContainer = document.getElementById('recent-questions-container');

        const username = document.getElementById('username');
        const fullName = document.getElementById('fullname');
        const emailText = document.getElementById('email');

        const qstCount = document.getElementById('questions-count');
        const ansCount = document.getElementById('answers-count');

        username.innerHTML = user.username;
        fullName.innerHTML = `${user.first_name} ${user.last_name}`;
        emailText.innerHTML = user.email;

        qstCount.innerHTML = `You have asked ${res.questions.length} questions`;

        getData(`/questions/user/${user.user_id}`, (err1, res1) => {
          if (!err1) {
            if (res.status === 'success') {
              saveCookie('token', res1.token);
              saveCookie('user', JSON.stringify(res1.user));
              const eng = res1.user.answer_count <= 1 ? 'answer' : 'answers';
              ansCount.innerHTML = `You have ${res1.user.answer_count} ${eng}`;
            }
          }
        });

        popQues = res.questions.sort((a, b) => b.answer_count - a.answer_count);

        popQues.forEach((question) => {
          popQuestionContainer.innerHTML += `<div class="question-row">
    <div class="col-2 info">
      <div class="brief-info" style="">
        <div class="counts"><span title="0 answers">${question.answer_count}</span></div>
        <div class="up-line-ans">Answers</div>
        <div class="str-line-ans">${question.answer_count} Answers</div>
        </div>
    </div>
    <div class="col-8 summary" style="text-align: left">
      <h2><a onclick="moveToQuestionPage('${question.question_id}')" href="#" style="font-size: 18px;" class="question-anchor">${question.title}</a></h2>
      <div class="tags">
        ${question.category}
      </div>
      <br/>
        <div style="height: 1px; background-color: slategrey;"></div>
    </div>
    
  </div>`;
        });

        rcntQues = res.questions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        rcntQues.forEach((question) => {
          recentQuestionContainer.innerHTML += `<div class="question-row">
    <div class="col-2 info">
      <div class="brief-info" style="">
        <div class="counts"><span title="0 answers">${question.answer_count}</span></div>
        <div class="up-line-ans">Answers</div>
        <div class="str-line-ans">${question.answer_count} Answers</div>
      </div>
    </div>
    <div class="col-8 summary" style="text-align: left">
      <h2><a onclick="moveToQuestionPage('${question.question_id}')" href="#" style="font-size: 18px;" class="question-anchor">${question.title}</a></h2>
      <div class="tags">
        ${question.category}
      </div>
      <br/>
        <div style="height: 1px; background-color: slategrey;"></div>
    </div>
    
  </div>`;
        });
      }
    }
  });
});
