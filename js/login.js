"use strict";

let elForm = document.querySelector(".login__form");
let elLogin = document.querySelector(".input-login");
let elPassword = document.querySelector(".input-password");

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  let inputlogin = elLogin.value;
  let inputPassword = elPassword.value;

  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: inputlogin,
      password: inputPassword,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        loginError.classList.add("visually-hidden");
        window.localStorage.setItem("token", data.token);
        window.location.replace("index.html");
      } else {
        loginError.classList.remove("visually-hidden");
        elLogin.value = null;
        elPassword.value = null;
      }
    });
});
