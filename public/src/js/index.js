const moveToQuestionPage = (questionId) => {
  saveCookie('question_id', questionId);
  window.location.href = './question.html';
};

window.addEventListener('load', (ev) => {
  const user = getSavedUser();
  if (!user) {
    window.location.href = './login.html';
  }

  if (window.location.href.search('index') !== -1) {
    getData('/questions', (err, res) => {
      if (err) return;
      if (res.status === 'success') {
        saveCookie('token', res.token);
        const questions = res.questions;
        const homeContainer = document.getElementById('questions-container');

        questions.forEach((question) => {
          homeContainer.innerHTML += `<div class="question-row">
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
      <div></div>
    </div>
  </div>`;
        });
      }
    });
  }
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchText = document.getElementById('search-input').value;
    saveCookie('search_input', searchText);
    window.location.href = './search.html';
  });
});

const showAddQuestionPopUp = () => {
  document.body.innerHTML += `<div id="post-question-modal" class="modal">
<div class="modal-content">
    <div class="modal-header">
      <span class="close" id="close-modal">&times;</span>
      <h2>Post A Question</h2>
    </div>
    <div class="modal-body">
      <form method="post" id="post-question-form" style="display: flex; flex-flow: column; align-items: center">
        <input class="auth-input" id="category" name="category" type="text" placeholder="Category" minlength="3"
           required style="width: 100%"/>
        <input class="auth-input" id="title" name="title" type="text" placeholder="Title" minlength="4"
           required style="width: 100%"/>
        <textarea title="comment" id="question-textarea" name="content" style="width: 100%; height: 100px" required></textarea>
        <br/>
        <input type="submit" value="Post Question" style="color: white"/>
        <br/>
      </form>
    </div>
  </div>
  </div>`;
  const postQuestionModal = document.getElementById('post-question-modal');
  postQuestionModal.style.display = 'block';
  window.onclick = (event) => {
    if (event.target === postQuestionModal) {
      postQuestionModal.style.display = 'none';
    }
  };
  const closeModalButton = document.getElementById('close-modal');
  const titleText = document.getElementById('title');
  const categoryText = document.getElementById('category');
  const contentText = document.getElementById('question-textarea');

  closeModalButton.onclick = () => {
    postQuestionModal.style.display = 'none';
  };
  document.getElementById('post-question-form').addEventListener('submit', (ev) => {
    const category = categoryText.value;
    const title = titleText.value;
    const content = contentText.value;

    postData('/questions', { category, title, content }, (err, res) => {
      if (err) return;
      if (res.status === 'success') {
        location.reload();
      }
    });
  });
};

const logout = () => {
  document.cookie = 'user=; path=/;';
  document.cookie = 'token=; path=/;';
  window.location.href = './login.html';
};
