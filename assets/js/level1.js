"use strict";

document.addEventListener("DOMContentLoaded", init);

let account_id;
let imageContainer;
let discardPile;
let home;
let keepPile;
let scoreHolder;
let keep = [];
let yes;
let no;
let questionsAndAnswers = [
    {question: "How many family members are there?", answers: [1, 2, 3, 4, 5, "I don't know"], correct: 4},
    {question: "How many devices do they use?", answers: [1, 2, 3, 4, 5, "I don't know"], correct: 4},
    {question: "Do they have a landline?", answers: ["yes", "no", "I don't know"], correct: "no"},
    {question: "Does anyone use a cloud service?", answers: ["yes", "no", "I don't know"], correct: "yes"},
    {question: "Do they use netflix?", answers: ["yes", "no", "I don't know"], correct: "yes"},
    {question: "What language do they most likely speak?", answers: ["dutch", "french", "english", "german", "I don't know"], correct: "english"},
    {question: "Are they planning on moving houses?", answers: ["yes", "no", "I don't know"], correct: "yes"}
];
let question = 0;
let enlarged = false;
let score = 0;

function init(){
    if (window.sessionStorage.getItem("loggedIn")) {
        account_id = window.localStorage.getItem("Account_id");
    } else {
        window.location.href = "login.html";
    }

    imageContainer = document.querySelector("#all_images");
    discardPile = document.querySelector("#discard div");
    keepPile = document.querySelector("#keep div");
    scoreHolder = document.querySelector("#score");

    home = document.querySelector("#back");
    yes = document.querySelector("#yes");
    no = document.querySelector("#no");
    home.addEventListener("click", confirmationMessage);
    yes.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });
    no.addEventListener("click", removeModal);

    discardPile.addEventListener("dragover", allowDrop);
    keepPile.addEventListener("dragover", allowDrop);
    discardPile.addEventListener("drop", drop);
    keepPile.addEventListener("drop", drop);



    document.querySelector("#keep button").addEventListener("click", nextStep);

    document.querySelector("#intro button").addEventListener('click', removeModal);
    document.querySelector("#middle button").addEventListener('click', removeModal);
    document.querySelector("#outro button").addEventListener("click", (el)=>{
        el.preventDefault();
        window.location.href = "index.html";
    });

    fillImageContainer();
}


function fillImageContainer() {
    for(let i = 1; i <= 14; i++){
        let x = Math.random() * 70;
        let y = Math.random() * 30;
        imageContainer.innerHTML += `<figure draggable="true" id="img${i}"><img draggable="false" src="media/level_3/${i}.jpg" alt="${i}"></figure>`;
        imageContainer.lastChild.style.left = `${x}%`;
        imageContainer.lastChild.style.top = `${y}%`;
    }
    document.querySelectorAll("figure").forEach((el) => {
        el.addEventListener("dragstart", drag);
        el.addEventListener("dragover", allowDrop);
    })
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let dropElement = document.querySelector(`#${data}`);
    let dropZone = ev.target;
    dropElement.style.removeProperty("left");
    dropElement.style.removeProperty("top");

    if(dropZone.tagName === "IMG"){
        dropZone = dropZone.parentElement.parentElement;
    }else if(dropZone.tagName === "BUTTON" || dropZone.tagName === "FIGURE"){
        dropZone = dropZone.parentElement;
    }

    dropZone.appendChild(dropElement);

    if(dropZone.parentElement.getAttribute("id") === "keep"){
        document.querySelector("#keep button").style.display = "block";
        if(keep.length < 6){
            if(!keep.includes(data.slice(3, data.length))){
                keep.push(data.slice(3, data.length));
            }
        }else{
            alert("You have exceeded the pictures to keep!");
            dropZone.removeChild(dropElement);
            imageContainer.appendChild(dropElement);
        }
    }else{
       if(keep.includes(`${data.slice(3, data.length)}`)){
           keep.splice(keep.indexOf(`${data.slice(3, data.length)}`), 1);
       }
    }
}

function nextStep(e){
    e.preventDefault();
    
    document.querySelector("#middle").style.display = "block";
    document.querySelector("#message").style.display = "initial";

    document.querySelector("#choose-pictures").style.display = "none";
    document.querySelector("#answer-questions").style.display = "inline-flex";
    for(let i = 0; i < keep.length; i++){
        document.querySelector("#help-pictures div").innerHTML += `<figure id="img${keep[i]}"><img src="media/level_3/${keep[i]}.jpg" alt="${keep[i]}"></figure>`;
    }
    document.querySelectorAll("#help-pictures div figure").forEach((el) => {
        el.addEventListener("click", enlargePicture);
    });
    loadAnswers();
}

function enlargePicture(e){
    e.preventDefault();
    let img = e.target;
    if(img.classList.contains("enlarged")){
        img.classList.remove('enlarged');

    }else{
        img.classList.add('enlarged');
    }
}

function checkAnswers(e){
    e.preventDefault();
    let answer = e.target.innerText;
    let currentQuestion = questionsAndAnswers[question];
    if(answer === currentQuestion.correct.toString()){
        score += 20;
    }else if(answer !== "I don't know"){
        if(score - 5 > 0){
            score -= 5;
        }
    }
    scoreHolder.innerText = `Score: ${score}`;
    question++;
    loadAnswers();
}

function loadAnswers(){
    if(question < questionsAndAnswers.length){
        let currentQuestion = questionsAndAnswers[question];
        let answerBox = document.querySelector("#answers");
        answerBox.innerHTML = `<p>${currentQuestion.question}</p>`;
        for(let i = 0; i < currentQuestion.answers.length; i++){
            answerBox.innerHTML += `<button>${currentQuestion.answers[i]}</button>`;
        }
    
        document.querySelectorAll("#answers button").forEach((el) => {
            el.addEventListener("click", checkAnswers);
        });
    }else{
        setLevel(account_id, 3);
        giveScore(score, account_id);
        document.querySelector("#outro").style.display = "block";
        document.querySelector("#message").style.display = "initial";
    }
    
}

function removeModal(e){
    e.target.preventDefault;
    document.querySelector("#message").style.display = "none";
    document.querySelector("#intro").style.display = "none";
    document.querySelector("#middle").style.display = "none";
    document.querySelector("#confirmation").style.display = "none";
  }

  function confirmationMessage(e){
      e.preventDefault();
      document.querySelector("#confirmation").style.display = "block";
      document.querySelector("#message").style.display = "initial";
  }