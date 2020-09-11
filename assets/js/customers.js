"use strict";

let list = [0, 20, 40, 60, 80, 100, 0, 0, 0, 0, 0];

function fillData(){
    for(let i = 0; i < customers.length; i++){
        let tempList = Array.from(list);
        let userList = []
        for(let j = 0; j < 11; j++){
            let random = getRandomInt(0, tempList.length - 1);
            let number =  tempList.splice(random, 1);
            userList.push(number)
        }
        customers[i].answers = userList;
    }
    console.log(JSON.stringify(customers));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let customers = [
    {name:"Guillaume Boutin",age:40,sex:"male",answers:[[80],[0],[0],[100],[0],[20],[0],[60],[0],[0],[40]], extra: "I have 4 children and i want something for my tv."},
    {name:"Anne-Sophie Lotgering",age:38,sex:"female",answers:[[0],[80],[0],[0],[100],[60],[20],[0],[0],[40],[0]], extra:"I want a new internet subscription that's sufficient to download a lot of data."},
    {name:"Christophe Van de Weyer",age:52,sex:"male",answers:[[0],[40],[0],[20],[60],[0],[0],[0],[100],[0],[80]], extra:"I want a new mobile subscription"},
    {name:"Jim Casteele",age:20,sex:"male",answers:[[0],[0],[0],[100],[60],[20],[0],[80],[40],[0],[0]], extra: "I need something for my children."},
    {name:"Renaud Tilmans",age:44,sex:"male",answers:[[0],[60],[0],[0],[100],[80],[0],[0],[20],[0],[40]], extra:"I need an internet subscription."},
    {name:"Judith Regent",age:19,sex:"female",answers:[[0],[20],[100],[80],[0],[0],[40],[0],[0],[0],[60]], extra:"I like to watch shows after they have aired."},
    {name:"Geert Goethals",age:28,sex:"male",answers:[[40],[0],[0],[60],[100],[0],[0],[20],[0],[80],[0]]},
    {name:"Jan van Acoleyen",age:38,sex:"male",answers:[[0],[60],[0],[0],[80],[0],[0],[20],[40],[100],[0]], extra:"I want a cheap mobile pack."},
    {name:"Hilde de Volder",age:17,sex:"female",answers:[[0],[0],[0],[60],[20],[80],[0],[0],[0],[100],[40]]},
    {name:"Serge Peeters",age:25,sex:"male",answers:[[80],[0],[0],[100],[60],[0],[0],[0],[0],[20],[40]]},
    
    {name:"Jan Smit",age:40,sex:"male",answers:[[0],[0],[0],[60],[0],[0],[0],[100],[40],[20],[80]], extra:"I need a big mobile subscription."},
    {name:"Emma Verbeeck",age:38,sex:"female",answers:[[0],[0],[100],[0],[80],[0],[60],[0],[0],[40],[20]]},
    {name:"Louis de Smid",age:52,sex:"male",answers:[[100],[0],[0],[40],[0],[0],[60],[20],[0],[80],[0]], extra:"I like football a lot"},
    {name:"Gabriel de Vlieger",age:20,sex:"male",answers:[[0],[0],[60],[40],[80],[0],[0],[20],[100],[0],[0]]},
    {name:"Victor Claes",age:44,sex:"male",answers:[[80],[40],[0],[60],[0],[0],[100],[0],[0],[0],[20]], extra:"My phone supports 5g so i'd like to upgrade my mobile subscription."},
    {name:"Anna Jacobs",age:19,sex:"female",answers:[[0],[100],[0],[0],[40],[0],[0],[60],[20],[0],[80]], extra:"I want to watch netflix."},
    {name:"Lucy Jackson",age:28,sex:"female",answers:[[0],[20],[100],[0],[0],[0],[60],[0],[0],[80],[40]]},
    {name:"Philippe Wouters",age:38,sex:"male",answers:[[0],[0],[60],[100],[80],[40],[0],[0],[20],[0],[0]]},
    {name:"Pieter Baerd",age:17,sex:"male",answers:[[100],[60],[0],[0],[40],[0],[0],[0],[20],[0],[80]]},
    {name:"John David",age:25,sex:"male",answers:[[60],[0],[100],[0],[0],[0],[0],[20],[40],[0],[80]]}
    ];
