//Making it pwa
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('sw.js')
//     .then(function(){
//         console.log('ServiceWorker registered');
//     });
// }

// Variables setup
var cardsList = document.getElementById("itemCards");
var itemAddForm = document.getElementById("itemAddForm");
var itemTitle = document.getElementById("title");
var itemText = document.getElementById("text");
var contentID = document.getElementById("contentID");
var deleteButton = $("#deleteButton");
var deleteCardsButton = $("#deleteCardsButton");
var itemAddModal = $("#itemAdd");
const jobDone = document.getElementById("jobDone");
var jobDoneText = $("#jobDoneText");
var btnItemAdd = $("#btnItemAdd");
let getData = localStorage.getItem("listapp") ? JSON.parse(localStorage.getItem("listapp")) : [];
let isEdit = false, editId;
let isDebouncing = false;

// Page load checks
$(document).ready(function(){
    
    deleteButton.hide();
    
    showCards();

    checkForItems();

});

// Functions

function checkForItems() {
    if (localStorage.getItem("listapp") === null) {
        deleteCardsButton.hide();
    }

    var listAppContent = localStorage.getItem('listapp');

    if (!listAppContent || listAppContent === '[]' || listAppContent === '{}' || $.trim(listAppContent) === "") {
        // Hide the button if "listapp" is empty or contains invalid content
        deleteCardsButton.hide();
    }
}

// Builds the new element with information retrieved from Localstorage and inserts into DOM
function showCards() {
    
    if (localStorage.getItem("listapp") !== null) {
        deleteCardsButton.show();
    }

    document.querySelectorAll(".cards-details").forEach(info => info.remove());
    cardsList.innerHTML = ""; // clear before adding new

    getData.forEach((element, index) => {
        // set background if marked as done
        let bgColor = element.done ? "background-color: #d4edda;" : "";

        let createCard = `
        <div class="card cards-details" 
            style="width: 18rem; ${bgColor}"
            data-index="${index}">
            <div class="card-body">
                <span style="display:none" id="'${index}'">'${index}'</span>
                <h5 class="card-title">${element.Title}</h5>
                <p class="card-text">${element.Text}</p>
                <div class="form-check mt-2">
                    <input class="form-check-input done-checkbox" type="checkbox" id="done-${index}" ${element.done ? "checked" : ""}>
                    <label class="form-check-label" for="done-${index}">Done</label>
                    <button class="btn btn-danger" onclick="deleteCard(${index})"> <i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
        </div>
        `;
        cardsList.innerHTML += createCard;    
    });

    // add click event to all new checkboxes
    $(".done-checkbox").on("change", function() {
        let cardIndex = $(this).closest(".card").data("index");
        let isChecked = $(this).is(":checked");
        toggleDone(cardIndex, isChecked);
    });
}

// Toggle done state, change color and save to localStorage
function toggleDone(index, doneStatus) {
    getData[index].done = doneStatus;

    // Update background color immediately
    const card = document.querySelector(`[data-index='${index}']`);
    if (card) {
        card.style.backgroundColor = doneStatus ? "#d4edda" : "";
    }

    // Save to localStorage
    localStorage.setItem("listapp", JSON.stringify(getData));
}

// Delete a single card based on the index retrieved from Localstorage
function deleteCard(index) {
    if (confirm("Confirmar a exclusão?")) {
        if (isDebouncing) return;
        isDebouncing = true;
    
        setTimeout(() => {
            isDebouncing = false;
        }, 500);
        
        getData.splice(index, 1);
        localStorage.setItem("listapp", JSON.stringify(getData));
        checkForItems();
        location.reload();
    }
}

// Updates a single card based on the index retrieved from Localstorage
function updateCard(index, title, text) {
    isEdit = true;
    editId = index;
    deleteButton.show();
    itemTitle.value = title;
    itemText.value = text;
    jobDone.value = index;
    showCards();

    deleteButton.on("click", function() {
        deleteCard(index);   
    });
}

// Deletes all present content in Localstorage
function deleteAllCards() {
    if (confirm("Confirmar a exclusão de todos os cards?")) {
        localStorage.removeItem('listapp');
    }
    checkForItems();
    location.reload();
}

// Checks if New Item was clicked and changes base parameters
btnItemAdd.on("click", function() {
    isEdit = false;
    deleteButton.hide();
    itemTitle.value = '';
    itemText.value = '';
});

// Global control for the submit button to either save a new item or edit a previously created one
itemAddForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const information = {
        Title: itemTitle.value,
        Text: itemText.value,
        done: false // add done status to new items
    }

    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;  
    }

    localStorage.setItem("listapp", JSON.stringify(getData));
    showCards();
    checkForItems();
    itemAddModal.modal('toggle');
});

jobDone.addEventListener("click", function() {
    let contentIndex = $(this).val();
    checkedJob($(this), contentIndex);
});
