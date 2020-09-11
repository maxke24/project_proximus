let playerUrl = `${config.root}/A/records`;
let teamUrl = `${config.root}/E/records`;
let challengeUrl = `${config.root}/F/records`;
let team_id;
function giveScore(score, account_id){
    getScore(account_id, (oldScore) => {
        let body = [{
            "id": account_id,
            "fields": {
                "score": score + oldScore
            }
        }];

        fetchFromServer(playerUrl, "POST", body);
    })
    

    
    getTeamId((id) => {
        getTeamScore(id, (oldScore) => {
            giveTeamScore(id, score + oldScore);
        });
    });
        

}

function testing(){
    fetchFromServer(config.root, "GET").then((response) =>{
        console.log(response);
    });
}

function getScore(account_id, cb){
    fetchFromServer(playerUrl + `/${account_id}`, "GET").then((response) =>{
        cb(response.fields.score);
    });

}

function giveTeamScore(id, score){
    let teamBody = [{
        "id": id,
        "fields": {
            "score": score
        }
    }];
    fetchFromServer(teamUrl, "POST", teamBody);
}

function getTeamId(cb){
    fetchFromServer(playerUrl + `/${account_id}`, "GET").then((response) =>{
        team_id = response.fields.teamId;
       cb(team_id);
    }); 
}

function getTeamScore(team_id, cb){
    fetchFromServer(teamUrl + `/${team_id}`, "GET").then((response) =>{
        cb(response.fields.score);
    });
}

function joinTeam(account_id, team_id){
    let body = [{
        "id": account_id,
        "fields": {
            "teamId": team_id
        }
    }];

    fetchFromServer(playerUrl, "POST", body).then(() => {
        window.location.reload();
    });
}

function createTeam(account_id, name){
    let teamBody = [{
        "fields": {
            "name": name,
            "score": 0
        }
    }];
    fetchFromServer(teamUrl, "POST", teamBody).then((response) => {
        let id = response[0].id;
        joinTeam(account_id, id);
    });
}

function calculateTeamPoints(teamId){
    fetchFromServer(`${playerUrl}?filters={"fields":{"TeamId":"${teamId}"}}`, "GET").then((response) =>{
        let score = 0;
        for(let i = 0; i < response.length; i++){
            score += response[i].fields.score;
        }
        if(teamId){
            giveTeamScore(teamId, score);
        }
    });
}

function setLevel(account_id, level){
    let body = [{
        "id": account_id,
        "fields": {
            "level": level
        }
    }];

    fetchFromServer(playerUrl, "POST", body);
}

function getAllChallengeables(account_id, cb){
    let members = [];
    getTeamId((id) => {
        fetchFromServer(`${playerUrl}`, "GET").then((response) =>{
            for(let i= 0; i < response.length; i++){
                if(response[i].fields.teamId !== id){
                    members.push(response[i]);
                }
                cb(members)
            }
        });
    });
}

function sendChallenge(account_id, other, level, path, score){
    let challengeBody = [{
        "fields": {
            "challenger": account_id,
            "challenged": other,
            "level": level,
            "path": path,
            "score": score
        }
    }];
    fetchFromServer(challengeUrl, "POST", challengeBody);
}

function getChallenges(account_id, cb){
    fetchFromServer(`${challengeUrl}?filters={"fields":{"Challenged":"${account_id}"}}`, "GET").then((response) =>{
        cb(response);
    });
}

function getPerson(id, cb){
    fetchFromServer(`${playerUrl}/${id}`, "GET").then((response) =>{
        cb(response);
    });
}

function getChallenge(id, cb){
    fetchFromServer(`${challengeUrl}/${id}"}}`, "GET").then((response) =>{
        cb(response);
    });
}

function getTeams(cb){
    fetchFromServer(`${teamUrl}?order=Score&desc=true`, "GET").then((response) =>{
        cb(response);
    });
}

function deleteChallenge(id){
    fetchFromServer(`${challengeUrl}/${id}"}}`, "DELETE");
}

function getMembers(id, cb){
    fetchFromServer(`${playerUrl}?order=Score&desc=true&filters={"fields":{"TeamId":"${id}"}}`, "GET").then((response) => {
        cb(response);
    });
}

function getPeople(cb){
    fetchFromServer(playerUrl, "GET").then((response) => {
        cb(response);
    });
}
