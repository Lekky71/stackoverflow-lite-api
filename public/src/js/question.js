
const formatDate = (date) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate(); const monthIndex = date.getMonth(); const
    year = date.getFullYear().toString().substr(-2);
  return `${monthNames[monthIndex]} ${day} '${year}`;
};

const voteAnswer = (questionId, answerId, type) => {
  putData(`/questions/${questionId}/answers/${answerId}/vote`, { vote: type }, (err, res) => {
    if (err) return;
    if (res.status === 'success') {
      location.reload();
    }
  });
};

const markAsPreferred = (questionId, answerId) => {
  putData(`/questions/${questionId}/answers/${answerId}/mark`, {}, (err, res) => {
    if (err) return;
    if (res.status === 'success') {
      location.reload();
    }
  });
};

const popUpComment = (questionId, answerId) => {
  const addCommentModal = document.getElementById('add-comment-modal');
  addCommentModal.style.display = 'block';
  window.onclick = (event) => {
    if (event.target === addCommentModal) {
      addCommentModal.style.display = 'none';
    }
  };
  const closeModalButton = document.getElementById('close-modal');
  closeModalButton.onclick = () => {
    addCommentModal.style.display = 'none';
  };
  const commentTextArea = document.getElementById('comment-textarea');
  document.getElementById('add-comment-form').addEventListener('submit', (ev) => {
    const content = commentTextArea.value;
    postData(`/questions/${questionId}/answers/${answerId}/comment`, { content }, (err, res) => {
      if (err) return;
      if (res.status === 'success') {
        location.reload();
      }
    });
  });
};

window.addEventListener('load', (ev) => {
  const title = document.getElementById('question-title');
  const content = document.getElementById('question-content');
  const tag = document.getElementById('question-tag');
  const questionDate = document.getElementById('question-date');
  const questionAsker = document.getElementById('question-asker');
  const answerCount = document.getElementById('answer-count');
  const allAnswersContainer = document.getElementById('all-answers');

  const fetchQuestion = (questionId) => {
    getData(`/questions/${questionId}`, (err, res) => {
      if (!err) {
        if (res.status === 'success') {
          const question = res.question;
          console.log(question);
          title.innerHTML = question.title;
          content.innerHTML = question.content;
          tag.innerHTML = question.category;
          const date = new Date(question.created_at);
          questionDate.innerHTML = `Asked on ${formatDate(date)}`;
          questionAsker.innerHTML = `By ${question.user.username}`;
          const count = question.answers.length;
          const eng = count <= 1 ? 'Answer' : 'Answers';
          answerCount.innerHTML = `${count} ${eng}`;

          question.answers.forEach((answer) => {
            let commentsHtml = '';
            answer.comments.forEach((comment) => {
              commentsHtml += `<div class="comment">
              <div style="height: 1px; background-color: slategrey; margin-bottom: 1%"></div>
              <p>${comment.content} - ${formatDate(new Date(comment.created_at))}</p> 
            </div>`;
            });

            const svgLink = question.preferred_answer_id === answer.answer_id ? 'orange_star.svg' : 'grey_star.svg';

            allAnswersContainer.innerHTML += `<div class="answer">
          <div class="vote-section item1" style="text-align: center">
            <img id="upvote-button" class="vote-button" src="./images/up-arrow.svg" onclick="voteAnswer('${question.question_id}', '${answer.answer_id}', 'up')">
            <br/>
            <h2 id="vote-count">${answer.up_votes - answer.down_votes}</h2>
            <br/>
            <img id="downvote-button" class="vote-button" src="./images/down-arrow.svg" 
            onclick="voteAnswer('${question.question_id}', '${answer.answer_id}', 'down')">
            <br/>
            <br/>
            <img id="upvote-button" class="vote-button" src="./images/${svgLink}" 
            onclick="markAsPreferred('${question.question_id}', '${answer.answer_id}')">
          </div>
          <div class="item2" style="">
            <p id="answer-text" class="col-12" style="font-size: 15px;">${answer.content}</p>
            <div class="col-12" style="display: flex; justify-content: flex-end;">
              <div class="tags answer-tag">
                <div class=""><span>Answered on ${formatDate(new Date(answer.created_at))}</span></div>
                <div>By ${answer.user.username}</div>
              </div>
            </div>
            <br/>
            <div id="link-a" onclick="popUpComment('${question.question_id}', '${answer.answer_id}')">Add a comment</div>
          </div>
          <div class="vote-section item3">
          </div>
          <div class="item4">
           ${commentsHtml}
          </div>
        </div>`;
          });
        }
      }
    });
  };

  const questionId = getCookie('question_id');
  fetchQuestion(questionId);
  document.getElementById('add-answer-form').addEventListener('submit', (ev) => {
    const answerTextArea = document.getElementById('answer-textarea');
    const content = answerTextArea.value.toString().trim();
    postData(`/questions/${questionId}/answer`, { content }, (err, res) => {
      if (res.status === 'success') {
        location.reload();
      }
    });
  });
});
