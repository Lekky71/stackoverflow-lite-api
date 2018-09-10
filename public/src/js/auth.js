window.addEventListener('load', (ev) => {
  const user = getSavedUser();
  if (user) {
    window.location.href = './index.html';
  }
  console.log('Page has been loaded');
  const loginForm = document.getElementById('login-form');
  const signUpForm = document.getElementById('signup-form');
  // const rootUrl = 'http://127.0.0.1:3000/api/v1';

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const loginButton = document.getElementById('login-button');
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errText = document.getElementById('error-text');
      errText.textContent = '';

      loginButton.style.visibility = 'hidden';
      postData('/auth/login', { username, password }, (err, res) => {
        console.log(JSON.stringify(err));
        if (!err) {
          console.log(res);
          if (res.status === 'failure') {
            errText.textContent = res.errors[0];
            loginButton.style.visibility = 'visible';
          } else {
            saveCookie('user', JSON.stringify(res.user));
            saveCookie('token', res.token);
            window.location.reload();
          }
        }
      });
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const signUpButton = document.getElementById('signup-button');
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const email = document.getElementById('email').value;
      const first_name = document.getElementById('first_name').value;
      const last_name = document.getElementById('last_name').value;

      const errText = document.getElementById('error-text');
      errText.textContent = '';
      signUpButton.style.visibility = 'hidden';

      postData('/auth/signup', {
        username, password, email, first_name, last_name,
      }, (err, res) => {
        if (!err) {
          console.log(res);
          if (res.status === 'failure') {
            errText.textContent = res.errors[0];
            signUpButton.style.visibility = 'visible';
          } else {
            saveCookie('user', JSON.stringify(res.user));
            saveCookie('token', res.token);
            window.location.reload();
          }
        }
      });
    });
  }
});
