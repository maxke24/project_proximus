"use strict";

document.addEventListener("DOMContentLoaded", init);

let pending;
let played;
let history;
let account_id;

function init(){

    if (window.sessionStorage.getItem("loggedIn")) {
        account_id = parseInt(window.localStorage.getItem("Account_id"));
    }else{
        window.location.href = "login.html";
    }

    pending = document.querySelector("#pending ul");
    played = document.querySelector("#played");
    history = document.querySelector("#history");

    fillPending();
    getHistory(account_id, (response) => {
        for(let i = 0; i < response.length; i++){
            let level = response[i].fields.level;
            let score = response[i].fields.score;
            let challengerId = response[i].fields.challengerId;
            if(challengerId){
                getPerson(challengerId, (person) => {
                history.innerHTML += `<li>+${score} on level ${level} against ${person.fields.name}</li>`;

                });
            }else{
                history.innerHTML += `<li>+${score} on level ${level}</li>`;
            }
        }
    });
}

function fillPending(){
    getAllChallenges((response) => {
        for (let i = 0; i < response.length; i++) {
            if(response[i].fields.challenger === account_id || response[i].fields.challenged === account_id){
                let challenge = response[i].fields;
                let opponent = challenge.challenger;
                let done = challenge.done;
                let winner = challenge.winner;
                if(account_id === challenge.challenger){
                    opponent = challenge.challenged;
                }
                if(done){
                    getPerson(opponent, (person) => {
                        if(winner === account_id){
                            played.innerHTML += `<li>You have won from ${person.fields.name} on level ${challenge.level}</li>`;
                        }else if(winner === 0){
                            played.innerHTML += `<li>You have tied with ${person.fields.name} on level ${challenge.level}</li>`;
                        }else{
                            played.innerHTML += `<li>You have lost from ${person.fields.name} on level ${challenge.level}</li>`;
                        }
                        
                    });
    
                }else{
                    getPerson(opponent, (person) => {
                        pending.innerHTML += `<li><a href="#" data-id="${response[i].id}">${person.fields.name} challenges you for level ${challenge.level}</a></li>`;
                        document.querySelectorAll("#challenges li a").forEach((el) => {
                            el.addEventListener("click", takeChallenge);
                        });
                    });
                } 
            }

        }
    });
}