"use strict";

var addToy = false;
var TOY_INDEX_URL = "http://localhost:3000/toys/";
document.addEventListener("DOMContentLoaded", function () {
  var addBtn = document.querySelector("#new-toy-btn");
  var toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", function () {
    // hide & seek with the form
    addToy = !addToy;

    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  renderToys(TOY_INDEX_URL); //create new toy form 

  document.getElementById("add-toy-form").addEventListener("submit", createToy);
});

var renderToys = function renderToys(url) {
  fetch(url).then(function (res) {
    return res.json();
  }).then(function (toys) {
    return toys.forEach(function (toy) {
      return displayToy(toy);
    });
  });
};

var displayToy = function displayToy(toy) {
  var toyDiv = document.createElement("div");
  toyDiv.className = "card";
  toyDiv.id = toy.id;
  document.getElementById("toy-collection").appendChild(toyDiv);
  var name = document.createElement("h2");
  name.innerText = toy.name;
  var image = document.createElement("img");
  image.className = "toy-avatar";
  image.src = toy.image;
  var likes = document.createElement("p");
  likes.innerText = toy.likes;
  var likesButton = document.createElement("button");
  likesButton.className = "like-btn";
  likesButton.innerText = "<3";
  var deleteButton = document.createElement("button");
  deleteButton.innerText = "X"; // appendChild elements to toyDiv

  toyDiv.append(deleteButton, name, image, likes, likesButton); //add likes with like button

  likesButton.addEventListener("click", function (event) {
    fetch("http://localhost:3000/toys/".concat(toy.id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        likes: ++toy.likes
      })
    }).then(function (response) {
      return response.json();
    }).then(function (updatedToy) {
      toy = updatedToy;
      likes.innerText = updatedToy.likes;
    });
  });
  deleteButton.addEventListener("click", function (event) {
    // step one: delete from database 
    fetch("http://localhost:3000/toys/".concat(toy.id), {
      method: "DELETE"
    }); // step two: remove toy card from page 

    toyDiv.remove();
  });
};

var createToy = function createToy(event) {
  event.preventDefault(); //creating newToyObject from create toy submission 

  var newToyObject = {};
  newToyObject.name = event.target.elements['name'].value; // newToyObject.name = event.target[0].value

  event.target.elements['name'].value = ""; //clear text box

  newToyObject.image = event.target.elements['image'].value; // newToyObject.image = event.target[1].value

  event.target.elements['image'].value = ""; //clear text box

  newToyObject.likes = 0; //sending request to POST newToyObject to server 
  //metadata (103- 105)

  var requestPackage = {};
  requestPackage.method = 'POST';
  requestPackage.headers = {
    "Content-Type": "application/json"
  }; //data

  requestPackage.body = JSON.stringify(newToyObject);
  fetch("http://localhost:3000/toys", requestPackage).then(function (response) {
    return response.json();
  }).then(function (toy) {
    return displayToy(toy);
  });
};