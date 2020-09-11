"use strict";

document.addEventListener("DOMContentLoaded", init);
let allPeople = [];
let buttons = [];
let peopleSearch;
let people = [];
let memberList;
let teams = [];
let account_id;
let teamSearch;
let teamName;
let teamList;
let members;
let teamId;


function init() {
    if (window.sessionStorage.getItem("loggedIn")) {
        account_id = window.localStorage.getItem("Account_id");
        getTeamsId((id) => {
            if (typeof id !== "undefined") {
                getTeamDetails(teamId);
            } else {
                document.querySelector("#no-team").style.display = "inline-flex";
                fetchFromServer(`${teamUrl}`, "GET").then((response) => {
                    for (let i = 0; i < response.length; i++) {
                        let team = response[i];
                        buttons.push([team.id, team.fields.name]);
                    }
                    fillButtons(buttons);
                });
            }
        });
        getTeams(teamId);
        
    } else {
        window.location.href = "login.html";
    }

    getPeople((response) => {
        for(let i = 0; i < response.length; i++){
            let id = response[i].id;
            let name = response[i].fields.name;
            let score = response[i].fields.score;
            let team = response[i].fields.teamId;
            allPeople.push([id, name, score, team]);

        }
    });

    teamList = document.querySelector("#teams ul");
    teamSearch = document.querySelector("#searchTeams");
    memberList = document.querySelector("#team-members");
    peopleSearch = document.querySelector("#searchPeople");

    teamSearch.addEventListener("input", searchTeams);
    peopleSearch.addEventListener("input", searchPeople);
    document.querySelector("#create-team").addEventListener("submit", createTeamId);
}

function getTeamsId(cb) {
    fetchFromServer(playerUrl + `/${account_id}`, "GET").then((response) => {
        teamId = response.fields.teamId;
        cb(teamId);

    });
}

function getTeams() {
    fetchFromServer(`${teamUrl}?order=Score&desc=true`, "GET").then((response) => {
            for (let i = 0; i < response.length; i++) {
                let team = response[i].fields;
                let id = response[i].id;
                teams.push([id, team.name, team.score]);
            }
        fillTeamList(teams);
    });
}

function getTeamMembers(id) {
    people = [];
    fetchFromServer(`${playerUrl}?order=Score&desc=true&filters={"fields":{"TeamId":"${id}"}}`, "GET").then((response) => {
        for (let i = 0; i < response.length; i++) {
            let name = `${response[i].fields.name}`;
            let score = `${response[i].fields.score}`;
            people.push([name, score]);
        }
        members = response;
        fillPeopleList(people);
    });
}

function joinTeamId(e) {
    e.target.preventDefault;
    let team_id = e.target.value;
    joinTeam(account_id, team_id);
}

function createTeamId(e) {
    e.preventDefault();
    let name = e.target.teamName.value;
    createTeam(account_id, name);
}

function showTeam(e){
    e.target.preventDefault;
    let id = e.target.getAttribute("data-id");
    if(id){
        getTeamDetails(id);
    }
}

function getTeamDetails(id){
    memberList.innerHTML = "";
    fetchFromServer(`${teamUrl}/${id}`, "GET").then((response) => {
        teamName = response.fields.name;
        memberList.innerHTML += `<li id="name">${teamName}: </li>`;
        getTeamMembers(id);
        calculateTeamPoints(id);
    });
}

function searchTeams(e){
    e.target.preventDefault;
    let tempList = [];
    let searchText = e.target.value.toLowerCase();
    for(let i = 0; i < teams.length; i++){
      if(teams[i][1].toLowerCase().indexOf(searchText) !== -1){
        tempList.push(teams[i]);
      }
    }
    fillTeamList(tempList);
    searchAllPeople(searchText);

}

function searchPeople(e){
    e.target.preventDefault;
    let tempList = [];
    let searchText = e.target.value.toLowerCase();
    if(teamId){
        for(let i = 0; i < people.length; i++){
            if(people[i][0].toLowerCase().indexOf(searchText) !== -1){
              tempList.push(people[i]);
            }
          }
          fillPeopleList(tempList);
    }else{
        for(let i = 0; i < buttons.length; i++){
            if(buttons[i][1].toLowerCase().indexOf(searchText) !== -1){
              tempList.push(buttons[i]);
            }
          }
          fillButtons(tempList);
    }   
}

function searchAllPeople(searchText){
    let tempList = [];
    for(let i = 0; i < allPeople.length; i++){
      if(allPeople[i][1].toLowerCase().indexOf(searchText) !== -1){
        tempList.push(allPeople[i]);
      }
    }
    fillAllPeople(tempList, searchText);
}

function fillTeamList(array){
    teamList.innerHTML = "<li id='name'>Teams: </li>";
    for(let j = 0; j < 1; j++){
      for (let i = 0; i < array.length; i++) {
        let id = array[i][0];
        let teamName = array[i][1];
        let teamScore = array[i][2];
        teamList.innerHTML += `<li><a href="#" id="id${id}" data-id="${id}">${i + 1}. ${teamName} | ${teamScore}</a></li>`;
      }
    }
    document.querySelectorAll("#teams ul li").forEach((el) => {
        el.addEventListener("click", showTeam);
    });
    let myTeam = document.querySelector(`#id${teamId}`);
    if(myTeam){
        myTeam.style.color = "rgb(255 45 130)";
    }
}

function fillAllPeople(array, searchText){
    if(searchText){
        teamList.innerHTML += "<li id='name'>People: </li>";
        for(let j = 0; j < 1; j++){
          for (let i = 0; i < array.length; i++) {
            let name = array[i][1];
            let score = array[i][2];
            let team = array[i][3];
            teamList.innerHTML += `<li><a href="#" data-id="${team}">${i + 1}. ${name} | ${score}</a></li>`;
          }
        }
        document.querySelectorAll("#teams ul li").forEach((el) => {
            el.addEventListener("click", showTeam);
        });
    }

}

function fillPeopleList(array){
    memberList.innerHTML = "";
    memberList.innerHTML += `<li id="name">${teamName}: </li>`;
    for (let i = 0; i < array.length; i++) {
        let name = array[i][0];
        let score = array[i][1];
        memberList.innerHTML += `<li>${i + 1}. ${name} | ${score}</li>`;
    }
}

function fillButtons(array){
    document.querySelector("#join-team").innerHTML = ``;
    for(let i = 0; i < array.length; i++){
        let id = array[i][0];
        let name = array[i][1]
        document.querySelector("#join-team").innerHTML += `<button value="${id}">${name}</button>`;
    }
    document.querySelectorAll("#join-team button").forEach((el) => {
        el.addEventListener("click", joinTeamId);
    });
}

