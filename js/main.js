//Making it pwa
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('sw.js')
//     .then(function(){
//         console.log('ServiceWorker registered');
//     });
// }

var itemList = document.getElementById("data");

var itemAddForm = document.getElementById("itemAddForm");
var itemTitle = document.getElementById("title");
var itemText = document.getElementById("text");
var itemAddSubmit = document.querySelector(".submit");
var formTitle = document.querySelector(".modal-title");
var itemAddModal = $("#itemAdd");
var btnItemAdd = $("#btnItemAdd");

let getData = localStorage.getItem("listapp") ? JSON.parse(localStorage.getItem("listapp")) : [];

let isEdit = false, editId;
showItems();

function showItems() {
    document.querySelectorAll(".item-details").forEach(info => info.remove());
    getData.forEach((element, index) => {
        let createElement = `<tr class="item-details">
        <td>${index + 1}</td>
        <td>${element.Title}</td>
        <td>
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#itemRead" onclick="readItemDetail('${index}', '${element.Title}', '${element.Text}')"><i class="bi bi-eye"></i></button>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#itemAdd" onclick="editItemDetail('${index}', '${element.Title}', '${element.Text}')"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#itemDelete" onclick="deleteItemDetail('${index}')"><i class="bi bi-trash"></i></button>
        </td>
        </tr>
        `;

        itemList.innerHTML += createElement;
    });
}

function readItemDetail(index, title, text) {
    document.querySelector("#showTitle").value = title;
    document.querySelector("#showText").value = text;
}

function editItemDetail(index, title, text) {
    isEdit = true;
    editId = index;
    formTitle.innerText = "Editar item";
    itemAddSubmit.innerText = "Atualizar";
    itemTitle.value = title;
    itemText.value = text;
    showItems();
}

function deleteItemDetail(index) {
    if (confirm("Confirmar a exclusão?")) {
        getData.splice(index, 1);
        localStorage.setItem("listapp", JSON.stringify(getData));
        showItems();
    }
}

btnItemAdd.on("click", function() {
    isEdit = false;
    formTitle.innerText = "Adicionar novo item";
    itemAddSubmit.innerText = "Enviar";
    itemTitle.value = '';
    itemText.value = '';
});

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
    showItems();
    itemAddModal.modal('toggle');
});