"use strict";

function fetchFromServer(url, httpVerb, requestBody){
    const options = {method: httpVerb, headers: {"Content-Type": "application/json", Authorization: "Bearer 384b9f80-e143-11ea-8a06-17a1274a20f0"}};
    options.body = JSON.stringify(requestBody);

    return fetch(url, options)
    .then((response) => {
        if(!response.ok && response.status === 500){
            console.table(response);
        }else if(response.status === 403){
            console.log("unauthorized");
        }else{
            return response.json();
        }
    })
    .then((jsonresponseyouarelookingofor) => {
        return jsonresponseyouarelookingofor;
    })
}