const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnLoginPopup = document.querySelector(".btnLogin-popup");
const loginButton = document.querySelector(".login-btn");
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageLogin = document.getElementById('message-login');
const messageRegister = document.getElementById('message-register');

function printhello() {
    //console.log("hello");
}

registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

btnLoginPopup.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

/*loginButton.addEventListener("click", () => {
    location.href = "mainpage.html";
});*/

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    //console.log("hello");

    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;
    //console.log(username);
    //console.log(password);

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${username}&password=${password}`,
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        //save username into the localstorage to be able to access it later
        localStorage.setItem('username', data.username);
        location.href = "mainpage.html";
      } else {
        messageLogin.innerHTML = "<p>" + data.message + "</p>";
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;
    //console.log(username);
    //console.log(password);

    fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
      })
      .then(response => response.json())
      .then(data => {
          messageRegister.innerHTML = "<p>" + data.message + "</p>";
      })
      .catch(error => {
        console.error('Error:', error);
      });
});


