import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-21e22-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartListInDB = ref(database, "cart");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

onValue(cartListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let cartArray = Object.entries(snapshot.val());
        clearList(shoppingListEl);

        for (let i = 0; i < cartArray.length; i++) {
            let currentItem = cartArray[i];
            listItems(shoppingListEl, currentItem, "cart");
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet";
    }
    
});

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    if (inputValue) {
        push(cartListInDB, inputValue);
    }
    clearValue(inputFieldEl);
})

function clearValue(element) {
    element.value = "";
}

function clearList(ul) {
    ul.innerHTML = "";
}

function listItems(ulElement, item, parentObj) {
    let currentItemID = item[0];
    let currentItemValue = item[1];

    let newEl = document.createElement("li");
    newEl.textContent = currentItemValue;

    newEl.addEventListener("click", function() {
        let exactLocOfItemInDB = ref(database, `${parentObj}/${currentItemID}`);
        remove(exactLocOfItemInDB);
    });

    ulElement.append(newEl);
}