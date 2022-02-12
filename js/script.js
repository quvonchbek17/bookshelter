"use strict";

//// LOGOUT ////

logout.addEventListener("click", function (evt) {
    let localToken = window.localStorage.getItem("token");
    if (localToken) {
      window.localStorage.removeItem("token");
    }
    window.location.replace("login.html");
});
