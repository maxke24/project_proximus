"use strict";

let button;
let loginForm;
let loginButton;
let loginErrors;
let registerForm;
let registerErrors;
let registerButton;

document.addEventListener("DOMContentLoaded", init);

function init(){
    button = document.querySelector("#btn");
    loginForm = document.querySelector("#login");
    registerForm = document.querySelector("#register");
    loginButton = document.querySelector("#login-button");
    loginErrors = document.querySelector("#login #errors");
    registerButton = document.querySelector("#register-button");
    registerErrors = document.querySelector("#register #errors");

    loginForm.addEventListener("submit", loginSubmit);
    registerForm.addEventListener("submit", registerSubmit);
}

function loginSubmit(e){
    e.preventDefault();
    loginErrors.innerHTML = "";
    let email = e.target.email.value;
    let password = e.target.password.value;
    fetchFromServer(`${playerUrl}?filters={"fields":{"Email":"${email}"}}`, "GET").then((response) =>{
        if(response.length > 0 && response[0].fields.password === password){
            window.sessionStorage.setItem("loggedIn", true);
            window.localStorage.setItem("Account_id", response[0].id);
            goToGame();
        }else{
            loginErrors.innerHTML += `<li>email or password is incorrect!</li>`;
        }
    });
}

function goToGame(){
    window.location.href = "index.html";
}

function register() {
    button.style.left = "110px";
    loginForm.style.left = "-110%";
    registerForm.style.left = "0rem";
    loginButton.style.color = "black";
    registerButton.style.color = "white";
}

function login() {
    button.style.left = "0rem";
    loginForm.style.left = "0rem";
    registerForm.style.left = "110%";
    loginButton.style.color = "white";
    registerButton.style.color = "black";

}

function registerSubmit(e){
    e.preventDefault();
    registerErrors.innerHTML = "";
    let email = e.target.email.value;
    let name = e.target.username.value;
    let password = e.target.password.value;
    let password2 = e.target.password2.value;
    let account = [{
        "fields": {
            "email": email,
            "password": password,
            "score": 0,
            "name": name,
            "level": 0
        }
    }];

    if(password === password2){
        let filter = `{"fields":{"Email":"${email}"}}`;
        fetchFromServer(`${playerUrl}?filters=${filter}`, "GET").then((response) =>{
            if(!response.length > 0){
                fetchFromServer(playerUrl, "POST", account).then((request) => {
                    window.sessionStorage.setItem("loggedIn", true);
                    window.localStorage.setItem("Account_id", request[0].id);
                    goToGame();
                });
            }else{
                registerErrors.innerHTML += `<li>email already in use!</li>`;
            }
        });
    }else{
        registerErrors.innerHTML += `<li>Warning, passwords don't match!</li>`;
    }
}
