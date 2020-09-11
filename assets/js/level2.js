"use strict";

let currentCustomer = 0;
let scorePlaceholder;
let tempCustomers;
let account_id;
let round = 0;
let score = 0;
let interval;
let seconds;
let counter;
let section;
let figure;
let info;
let home;
let yes;
let no;

document.addEventListener("DOMContentLoaded", init);

function init(){
    if(window.sessionStorage.getItem("loggedIn")){
        account_id = window.localStorage.getItem("Account_id");
    }else{
        window.location.href = "login.html";
    }

    tempCustomers = Array.from(customers);
    seconds = 60;

    info = document.querySelector("#info");
    figure = document.querySelector("figure");
    counter = document.querySelector("#counter");
    section = document.querySelector("#answers");
    scorePlaceholder = document.querySelector("#score");

    home = document.querySelector("#back");
    yes = document.querySelector("#yes");
    no = document.querySelector("#no");
    home.addEventListener("click", confirmationMessage);
    yes.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });
    no.addEventListener("click", removeConfirmationModal);

    document.querySelector("#intro button").addEventListener('click', removeModal);
    document.querySelector("#outro button").addEventListener("click", (el)=>{
        el.preventDefault();
        window.location.href = "index.html";
    });

    getRandomCustomer();
    loadAnswers();
}

function getRandomCustomer(){
    currentCustomer = Math.floor(Math.random() * tempCustomers.length);
    info.innerHTML = `<p>Hi, i'm ${tempCustomers[currentCustomer].name}, i'm ${tempCustomers[currentCustomer].age} years old.</p>`;
    if(tempCustomers[currentCustomer].extra){
        info.innerHTML += `<p>${tempCustomers[currentCustomer].extra}</p>`;
    }
    let id = getCustomerId();
    let img = `media/level_2/${id + 1}.png`;

    figure.innerHTML = `<img alt="preview" src="${img}"/>`;
}

function getCustomerId(){
    let name = tempCustomers[currentCustomer].name;
    for(let i = 0; i < customers.length; i++){
        if(customers[i].name === name){
            return i;
        }
    }
}

function checkAnswers(e){
    e.preventDefault;
    let id = parseInt(e.target.value);
    score += parseInt(tempCustomers[currentCustomer].answers[id]);
    scorePlaceholder.innerHTML = "Score: " + score;
    tempCustomers.splice(currentCustomer, 1);
    resetCountdown();
}

function loadAnswers(){
    section.innerHTML = "";
    let tempList = Array.from(answers);

    for(let i = 0; i < answers.length; i++){
        let id = Math.floor(Math.random() * tempList.length);
        let currentAnswer = answers.indexOf(tempList[id]);
        if(tempCustomers[currentCustomer].answers[currentAnswer][0] !== 0){
            section.innerHTML += `<button type="button" value="${currentAnswer}">${answers[currentAnswer]}</button>`
        }
        tempList.splice(id, 1);
    }

    document.querySelectorAll("#answers button").forEach((el) => {
        el.addEventListener("click", checkAnswers);
    });
}

function startCountDown(){
    counter.innerHTML = `Time: ${seconds}s`;
  
    if(seconds < 10){
        counter.style.color = "red";
    }else{
        counter.style.color = "white";
    }

    if (seconds < 0) {
        counter.innerHTML = "Time's up!";
        clearInterval(interval);
        setLevel(account_id, 2);
        giveScore(score, account_id);
        addToHistory(account_id, 2, score);
        document.querySelector("#outro").style.display = "block";
        document.querySelector("#message").style.display = "initial";
    }

    seconds--;
}

function resetCountdown(){
    // clearInterval(interval);
    round++;
    // if(round < 3){
    //     seconds = 60 - (20 * round);
    //     Math.round(seconds);
    // }else{
    //     seconds = 60 / (2* round);
    //     seconds = Math.floor(seconds);
    // }
    if(round < 10){
        getRandomCustomer();
        loadAnswers();
        // interval = setInterval(startCountDown, 1000);
    }else{
        clearInterval(interval);
        setLevel(account_id, 1);
        document.querySelector("#outro").style.display = "block";
        document.querySelector("#message").style.display = "initial";
    }
}

function removeModal(e){
    e.target.preventDefault;
    document.querySelector("#message").style.display = "none";
    document.querySelector("#intro").style.display = "none";
    interval = setInterval(startCountDown, 1000);
  }

  function removeConfirmationModal(e){
    e.target.preventDefault;
    document.querySelector("#message").style.display = "none";
    document.querySelector("#confirmation").style.display = "none";
  }

  function confirmationMessage(e){
      e.preventDefault();
      document.querySelector("#confirmation").style.display = "block";
      document.querySelector("#message").style.display = "initial";
  }