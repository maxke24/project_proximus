"use strict";
let recordDistance = Infinity;
let challengePerson;
let popSize = 5000;
let population = [];
let locations = [];
let allPoints = [];
let challengeScore;
let start = false;
let selectedPoint;
let userPath = [];
let fitness = [];
let currentBest;
let challengers;
let challengeId;
let people = [];
let order = [];
let account_id;
let challenge;
let total = 5;
let score = 0;
let round = 1;
let searchBox;
let computer;
let congrats;
let bestEver;
let totalScore = 0;
let userBest;
let section;
let beaten;
let close;
let state;
let outro;
let reset;
let intro;
let undo;
let lost;
let user;
let tie;
let img;

let home;
let yes;
let no;

function setup() {

  if (window.sessionStorage.getItem("loggedIn")) {
    account_id = window.localStorage.getItem("Account_id");
  } else {
    window.location.href = "login.html";
  }

  createCanvas(window.innerWidth * 0.76, window.innerHeight);

  selectedPoint = createVector(-100, -100);
  tie = document.querySelector("#tie");
  user = document.querySelector("#user");
  undo = document.querySelector("#undo");
  lost = document.querySelector("#lost");
  close = document.querySelector("#close");
  reset = document.querySelector("#reset");
  state = document.querySelector("#state");
  outro = document.querySelector("#outro");
  intro = document.querySelector("#intro");
  beaten = document.querySelector("#beaten");
  section = document.querySelector("section");
  searchBox = document.querySelector("#search");
  computer = document.querySelector("#computer");
  congrats = document.querySelector("#beat-opponent");
  challengers = document.querySelector("#challengers");
  challengePerson = document.querySelector("#challenge");

  home = document.querySelector("#back");
  yes = document.querySelector("#yes");
  no = document.querySelector("#no");
  home.addEventListener("click", confirmationMessage);
  yes.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
  });
  no.addEventListener("click", removeConfirmationModal);

  undo.addEventListener("click", undoMove);
  reset.addEventListener("click", resetPath);
  searchBox.addEventListener("input", search);
  close.addEventListener("click", removeModal);
  challengePerson.addEventListener("click", openChallengeModal);
  document.querySelector("#intro button").addEventListener('click', removeModal);

  challenge = new URLSearchParams(window.location.search).get("challenge");

  state.addEventListener("click", (e) => {
    e.preventDefault();
    if (challenge === "True") {
      if (userBest < challengeScore) {
        beaten.style.display = "block";
        beaten.innerHTML += `<p>Your score: ${userBest}`;
        beaten.innerHTML += `<p>Opponents score: ${challengeScore}`;
        giveScore(10, account_id);
        deleteChallenge(id, account_id);
        addToHistory(account_id, 3, 10, challengeId);

      }else if(userBest === challengeScore){
        tie.style.display = "block";
        giveScore(5, challengeId);
        giveScore(5, account_id);
        deleteChallenge(id, 0);
        addToHistory(account_id, 3, 5, challengeId);
        addToHistory(challengeId, 3, 5, account_id);

      }else{
        lost.style.display = "block";
        lost.innerHTML += `<p>Your score: ${userBest}`;
        lost.innerHTML += `<p>Opponents score: ${challengeScore}`;
        giveScore(10, challengeId);
        addToHistory(challengeId, 3, 10, account_id);
        deleteChallenge(id, challengeId);

      }
      congrats.style.display = "block";
      section.style.display = "initial";
      let id = parseInt(localStorage.getItem("challenge"));

    } else {
      if (start) {
        reset.style.display = "initial";
        undo.style.display = "initial";
        if (total < 25) {
          start = false;
          resetPlayingField();
          e.target.innerHTML = "Show correct solution!";
        } else {
          giveScore(totalScore, account_id);
          addToHistory(account_id, 3, totalScore);
          outro.style.display = "block";
          section.style.display = "initial";
        }
      } else {
        reset.style.display = "none";
        undo.style.display = "none";
        start = true;
        if(total < 25){
          e.target.innerHTML = "Play next round!";
        }else{
            e.target.innerHTML = "End level!";
        }
      }
    }

  });

  document.querySelector("#outro button").addEventListener("click", (el) => {
    el.target.preventDefault;
    window.location.href = "index.html";
  });

  document.querySelector("#beat-opponent button").addEventListener("click", (el) => {
    el.target.preventDefault;
    window.location.href = "index.html";
  });

  if (challenge !== "True") {
    fillPoints();
    getPeople();
  } else {
    let id = parseInt(localStorage.getItem("challenge"));
    getChallenge(id, (response) => {
      let path = response.fields.path.split(",");
      challengeId = response.fields.challenger;
      getPerson(challengeId, (person) => {
        beaten.innerHTML += `<p>You have beaten ${person.fields.name}!</p>`;
        lost.innerHTML += `<p>You have lost to ${person.fields.name}!</p>`;
        tie.innerHTML += `<p>You have tied with ${person.fields.name}!</p>`;
        state.innerHTML = `Let's see if you won from ${person.fields.name}`;
      });
      challengeScore = response.fields.score;
      let j = 0;
      for (let i = 0; i < path.length; i++) {
        if (i % 2 === 0) {
          let x = parseInt(path[i]);
          let y = parseInt(path[i + 1]);
          locations[j] = createVector(x, y);
          order[j] = j;
          allPoints.push([x, y]);
          j++;
        }
      }
      total = j;

      for (let i = 0; i < popSize; i++) {
        population[i] = shuffle(order);
      }
    });
  }
}

function draw() {
  noFill();
  stroke(200);
  beginShape();
  background(51);
  strokeWeight(4);
  for (let i = 0; i < userPath.length; i++) {
    const n = userPath[i];
    vertex(locations[n].x, locations[n].y);
  }

  endShape();

  if (userPath.length !== total) {
    state.style.display = "none";
    challengePerson.style.display = "none";
  } else {
    state.style.display = "initial";
    challengePerson.style.display = "initial";
  }

  if (start) {
    for(let i = 0; i < 5; i++){
      calculateFitness();
      normalizeFitness();
      nextGeneration();
    }

    noFill();
    beginShape();
    stroke(0);
    strokeWeight(2);
    stroke(0, 255, 0);

    for (let i = 0; i < bestEver.length; i++) {
      const n = bestEver[i];
      vertex(locations[n].x, locations[n].y);
    }
    endShape();
    computer.innerHTML = `computers length: ${Math.round(calculateDistance(bestEver))}`;

  }
  userBest = Math.round(calculateDistance(userPath));
  user.innerHTML = `Your length: ${userBest}`;

  fill(255);
  stroke(255);

  for (let i = 0; i < locations.length; i++) {
    image(img, locations[i].x - 16, locations[i].y - 48, 32, 32);
    ellipse(locations[i].x, locations[i].y, 16, 16);
  }

  stroke(0, 255, 0);
  fill(0, 255, 0);
  circle(selectedPoint.x, selectedPoint.y, 16);
}

function removeModal() {
  intro.style.display = "none";
  section.style.display = "none";
}

function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function resetPlayingField() {
  let bestLength = Math.round(calculateDistance(userPath));
  let userLength = Math.round(calculateDistance(bestEver));
  computer.innerHTML = `computers length: 0`;
  selectedPoint = createVector(-100, -100);
  recordDistance = Infinity;
  currentBest = [];
  population = [];
  popSize += 500;
  let diff = 100;
  order = [];
  locations = [];
  allPoints = [];
  userPath = [];
  bestEver = [];
  fitness = [];
  total += 5;

  if (bestLength !== userLength) {
    diff = Math.round(userLength / bestLength * 100);

  }
  totalScore += diff;
  fillPoints();
  for (let i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
}

function fillPoints() {
  order = [];
  for (let i = 0; i < total; i++) {
    let overlapping = false;
    const v = createVector(random(width), random(height));
    let x = v.x;
    let y = v.y;
    if (x < 16 || y < 48 || x > width - 16  || y > height - 16) {
      overlapping = true;
    }
    for (let j = 0; j < locations.length; j++) {
        if (x >= locations[j].x - 16 && x <= locations[j].x + 16 && y >= locations[j].y - 64 && y <= locations[j].y + 64) {
          overlapping = true;
        }
      }
  
  if (!overlapping) {
    locations[i] = v;
    order[i] = i;
    allPoints.push([v.x, v.y]);
  }else{
    i--;
  }
}

  for (let i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
}

function calcDistance(points, order) {
  let sum = 0;

  for (let i = 0; i < order.length - 1; i++) {
    const cityAIndex = order[i];
    const cityA = points[cityAIndex];
    const cityBIndex = order[i + 1];
    const cityB = points[cityBIndex];
    const d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function mouseClicked() {
  let x = mouseX;
  let y = mouseY;

  for (let i = 0; i < locations.length; i++) {
    if (x > locations[i].x - 16 && x < locations[i].x + 16 && y > locations[i].y - 16 && y < locations[i].y + 16) {
      selectedPoint.x = locations[i].x;
      selectedPoint.y = locations[i].y;
      if (!userPath.includes(i)) {
        userPath.push(i);
      }
    }
  }
}

function calculateDistance(points) {
  let d = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const n = points[i];
    const m = points[i + 1]
    d += dist(locations[m].x, locations[m].y, locations[n].x, locations[n].y);
  }

  return d;
}

function openChallengeModal(e) {
  e.target.preventDefault;
  fillPeopleList(people);
}

function fillPeopleList(array){
  let challengeList = document.querySelector("#challengers");
  challengeList.innerHTML = "";
  challengeList.style.display = "flex";
  section.style.display = "initial";
  for(let j = 0; j < 1; j++){
    for (let i = 0; i < array.length; i++) {
      let id = array[i][0];
      let member = array[i][1];
      challengeList.innerHTML += `<li><a href="#" class="challengers" data-id="${id}">${member}</a></li>`;
    }
  }
  
  document.querySelectorAll(".challengers").forEach((el) => {
    el.addEventListener("click", challengeMember);
  });
}

function getPeople(){
  getAllChallengeables(account_id, (members) => {
    for (let i = 0; i < members.length; i++) {
      let member = members[i].fields;
      if(!checkIfExists(people, [members[i].id, member.name])){
        people.push([members[i].id, member.name]);
      }
    }
  });
}

function challengeMember(e) {
  e.target.preventDefault;
  let other = e.target.getAttribute("data-id");
  let user = e.target.innerText;
  let highScore = Math.round(calculateDistance(userPath));
  let challengeList = document.querySelector("#challengers");
  challengeList.innerHTML = `You have challenged ${user}`;
  challengeList.innerHTML += "<button value='next'>Continue</button>"
  document.querySelector("#challengers button").addEventListener("click", removeModal);
  sendChallenge(account_id, other, 2, allPoints, highScore);
}

function preload() {
  img = loadImage('media/home.svg');
}

function checkIfExists(arr, check){
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === check[0]){
      return true;
    }
  }
  return false;
}

function search(e){
  e.target.preventDefault;
  let searchText = e.target.value;
  let tempList = [];
  for(let i = 0; i < people.length; i++){
    if(people[i][1].indexOf(searchText) !== -1){
      tempList.push(people[i]);
    }
  }
  fillPeopleList(tempList);
}

function undoMove(){
  userPath.splice(userPath.length - 1, 1);
}

function resetPath(){
  userPath = [];
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