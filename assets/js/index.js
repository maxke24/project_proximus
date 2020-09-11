"use strict";

let teamId;
let account_id;
let teamInformation;
let memberInformation;
let personalInformation;

document.addEventListener("DOMContentLoaded", init);

function init(){
    if (window.sessionStorage.getItem("loggedIn")) {
        account_id = window.localStorage.getItem("Account_id");
    }else{
        window.location.href = "login.html";
    }
    memberInformation = document.querySelector("#team-members ul");
    teamInformation = document.querySelector("#team-information ul");
    personalInformation = document.querySelector("#personal-information");
    document.querySelector("#create-team").addEventListener("submit", createTeamId);
    loadInformation();

    getChallenges(account_id, (response) => {
        for (let i = 0; i < response.length; i++) {
            let challenge = response[i].fields;
            let challenger = challenge.challenger;
            getPerson(challenger, (person) => {
                document.querySelector("#challenges").innerHTML += `<li><a href="#" data-id="${response[i].id}">${person.fields.name} challenges you for level ${challenge.level}</a></li>`;
                document.querySelectorAll("#challenges li a").forEach((el) => {
                    el.addEventListener("click", takeChallenge);
                });
            });
        }
        
    });
}

function loadInformation(){
    getPerson(account_id, (response) =>{
        let fields = response.fields;
        let userName = fields.name;
        let img = fields.profilePicture;
        if(!img){
            img = "default.png"
        }
        teamId = fields.teamId;
        calculateTeamPoints(teamId);
        loadTeams();
        loadMembers();
        personalInformation.innerHTML += `<h1><figure><img alt="profile picture" src="media/${img}"><figcaption>Hello ${userName}, welcome to the game!</figcaption></figure></h1>`;
    });
}

function loadTeams(){
    getTeams((response) => {
        fillAside(response, teamInformation);
        document.querySelector(`#id${teamId}`).style.color = "rgb(255 45 130)";
    });
}

function createTeamId(e) {
    e.preventDefault();
    let name = e.target.teamName.value;
    createTeam(account_id, name);
}

function loadMembers(){
    if(teamId){
        getMembers(teamId, (response) => {fillAside(response, memberInformation)});
    }else{
        document.querySelector("#no-team").style.display = "inline-flex";
        let headLine = document.querySelector("#team-members ul li h1");
        headLine.innerHTML = "Choose a team: ";
        getTeams((response) => {
            for (let i = 0; i < response.length; i++) {
                let team = response[i];
                document.querySelector("#join-team").innerHTML += `<button value="${team.id}">${team.fields.name}</button>`;
            }
            document.querySelectorAll("#join-team button").forEach((el) => {
                el.addEventListener("click", joinTeamId);
            });
        });
    }
}

function joinTeamId(e) {
    e.target.preventDefault;
    let team_id = e.target.value;
    joinTeam(account_id, team_id);
}

function fillAside(response, htmlElement){
    if(response.length <= 10){
        for(let i = 0; i < response.length; i++){
            htmlElement.innerHTML += `<li id="id${response[i].id}">${i + 1}. ${response[i].fields.name} | ${response[i].fields.score}</li>`;
        }
    }else{
        let classification = findClassification(response);
        let before = classification - 5;
        let after = classification + 5;
        console.log(classification, response.length);
        console.log(before, after);
        if(before < 0){
            after += Math.abs(before);
            before = 0;
        }else if(after > response.length){
            before -= Math.abs(after) - response.length;
            after = response.length;
        }
        console.log(before, after);
        for(let i = before; i < after; i++){
            htmlElement.innerHTML += `<li id="id${response[i].id}">${i + 1}. ${response[i].fields.name} | ${response[i].fields.score}</li>`;
        }
    }
}

function findClassification(array){
    for(let i = 0; i < array.length; i++){
        if(array[i].id === teamId){ 
            return i+1;

        }
    }
}

function takeChallenge(e){
    e.target.preventDefault;
    let challenge = e.target.getAttribute("data-id");
    localStorage.setItem("challenge", challenge);
    window.location = `level2.html?challenge=True`;
}
