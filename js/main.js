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

function checkedJob(button, index) {

    if (button.is(':checked')) {
        getData.forEach((element, i) => {
            if (index == i) {
                $('.card-body').css('background-color', 'green');
            }        
        });
  }
}

// Checks if the Localstorage has content. If it's empty it will hide the global button for Deleting All Cards
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
    
    getData.forEach((element, index) => {
        let createCard = `
        <div class="card cards-details" 
            style="width: 18rem;" 
            data-bs-toggle="modal" 
            data-bs-target="#itemAdd" 
            onclick="updateCard('${index}', '${element.Title}', '${element.Text}')">
            <div class="card-body">
                <span style="display:none" id="'${index}'">'${index}'</span>
                <h5 class="card-title">${element.Title}</h5>
                <p class="card-text">${element.Text}</p>
            </div>
        </div>
        `;
        cardsList.innerHTML += createCard;    
    });

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
