"use strict";

document.addEventListener("DOMContentLoaded", init);

let pending;
let history;
let account_id;

function init(){

    if (window.sessionStorage.getItem("loggedIn")) {
        account_id = window.localStorage.getItem("Account_id");
    }else{
        window.location.href = "login.html";
    }

    pending = document.querySelector("#pending ul");
    history = document.querySelector("#history ul");

    fillPending();
}

function fillPending(){
    getChallenges(account_id, (response) => {
        for (let i = 0; i < response.length; i++) {
            let challenge = response[i].fields;
            let challenger = challenge.challenger;
            let done = challenge.done;
            let winner = challenge.winner;
            if(done){
                getPerson(challenger, (person) => {
                    if(winner === account_id){
                        history.innerHTML += `<li>You have won from ${person.fields.name} on level ${challenge.level}</li>`;
                    }else if(winner === 0){
                        history.innerHTML += `<li>You have tied with ${person.fields.name} on level ${challenge.level}</li>`;
                    }else{
                        history.innerHTML += `<li>You have lost from ${person.fields.name} on level ${challenge.level}</li>`;
                    }
                    
                });

            }else{
                getPerson(challenger, (person) => {
                    pending.innerHTML += `<li><a href="#" data-id="${response[i].id}">${person.fields.name} challenges you for level ${challenge.level}</a></li>`;
                    document.querySelectorAll("#challenges li a").forEach((el) => {
                        el.addEventListener("click", takeChallenge);
                    });
                });
            } 
        }
    });
}