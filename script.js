import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-21e22-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartListInDB = ref(database, "cart");

const inputFieldEl = document.getElementById("input-field");
const inputCont = document.getElementById("input-container");
const shoppingListEl = document.getElementById("shopping-list");
const errorEl = document.getElementById("error");

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

inputCont.addEventListener("submit", function(event) {
    event.preventDefault();

    let inputValue = inputFieldEl.value.trim();
    const validLettersRegex = /^[a-zA-Z0-9\s]+$/;

    if (validLettersRegex.test(inputValue)) {
        errorEl.textContent = "";
        inputValue = capitalizeOnlyFirst(inputFieldEl.value);
        push(cartListInDB, inputValue);
    } else if (inputValue === "") {
        const messagesArray = [
            "You have to tell me what item to add!",
            "Write the item you wish to add",
            "I don't know what you want to add",
            "Fill the box above the button first!",
            "I can't read minds!"
        ];
        const message = randomNumber(5, messagesArray, errorEl);
        errorEl.textContent = messagesArray[message];
    } else {
        errorEl.textContent = "Please enter valid characters"
    }
    clearValue(inputFieldEl);
})

function capitalizeOnlyFirst(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function randomNumber(num, arr, whatEl) {
    let result = 0;
    do {
        result = Math.floor(Math.random() * num);
    } while (arr[result] === whatEl.textContent);
    return result;
}

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