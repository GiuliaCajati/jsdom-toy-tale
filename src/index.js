let addToy = false;
const TOY_INDEX_URL = "http://localhost:3000/toys/"

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });
    renderToys(TOY_INDEX_URL);

    //create new toy form 
    document.getElementById("add-toy-form").addEventListener("submit", createToy)

});

const renderToys = (url) => {
    fetch(url)
        .then((res) => res.json())
        .then(toys => toys.forEach(toy => displayToy(toy)))
}


const displayToy = (toy) => {
    let toyDiv = document.createElement("div");
    toyDiv.className = "card";
    toyDiv.id = toy.id;
    document.getElementById("toy-collection").appendChild(toyDiv);

    let name = document.createElement("h2");
    name.innerText = toy.name;

    let image = document.createElement("img");
    image.className = "toy-avatar";
    image.src = toy.image;

    let likes = document.createElement("p");
    likes.innerText = toy.likes;


    let likesButton = document.createElement("button");
    likesButton.className = "like-btn";
    likesButton.innerText = "<3";

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "X";

    // appendChild elements to toyDiv
    toyDiv.append(deleteButton, name, image, likes, likesButton)

    //add likes with like button
    likesButton.addEventListener("click", (event) => {
        fetch(`http://localhost:3000/toys/${toy.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    likes: ++toy.likes
                })
            })
            .then(response => response.json())
            .then(updatedToy => {
                toy = updatedToy
                likes.innerText = updatedToy.likes
            });

    })
    deleteButton.addEventListener("click", (event) => {
        // step one: delete from database 
        fetch(`http://localhost:3000/toys/${toy.id}`, {
                method: "DELETE"
            })
            // step two: remove toy card from page 
        toyDiv.remove()
    })

}

const createToy = (event) => {
    event.preventDefault();

    //creating newToyObject from create toy submission 
    let newToyObject = {}
    newToyObject.name = event.target.elements['name'].value // newToyObject.name = event.target[0].value
    event.target.elements['name'].value = "" //clear text box
    newToyObject.image = event.target.elements['image'].value // newToyObject.image = event.target[1].value
    event.target.elements['image'].value = "" //clear text box
    newToyObject.likes = 0

    //sending request to POST newToyObject to server 
    //metadata (103- 105)
    let requestPackage = {}
    requestPackage.method = 'POST';
    requestPackage.headers = { "Content-Type": "application/json" };
    //data
    requestPackage.body = JSON.stringify(newToyObject);

    fetch("http://localhost:3000/toys", requestPackage)
        .then(response => response.json())
        .then(toy => displayToy(toy))
}