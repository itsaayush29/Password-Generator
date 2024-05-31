// Selecting all necessary DOM elements
const lengthDisplay = document.querySelector("[data-lenghtnumber]");
const slideHandler = document.querySelector("[lenghthandler]");
const copy = document.querySelector(".button1");
const copyMsg = document.querySelector("[copy-msg]");
const displayPassword = document.querySelector("[display-password]");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const number = document.getElementById("numbers");
const symbol = document.getElementById("symbols");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".submit");

// Defining symbols to be used in the password
const symbols = '.,/`~!@#$%^&*()_+{}:"<>?|:|\\-=[]';

// Initial password length
let passwordLength = 10;
let password = "";
let checkCount = 0;

// Initializing the slider and length display
handleSlide();

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join(''); // Join the array into a string
}

// Function to update the slider and length display
function handleSlide() {
    slideHandler.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
}

// Function to set the color indicator based on password strength
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

// Function to generate a random integer between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Functions to generate random characters for the password
function generateNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 122));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 90));
}

function generateSymbol() {
    const randomNum = getRndInteger(0, symbols.length - 1);
    return symbols.charAt(randomNum);
}

// Function to calculate and set the password strength indicator
function calculateStrength() {
    let hasUpper = uppercase.checked;
    let hasLower = lowercase.checked;
    let hasNumber = number.checked;
    let hasSymbol = symbol.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#00ff00"); // Strong
    } else if ((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ffff00"); // Medium
    } else {
        setIndicator("#ff0000 "); // Weak
    }
}

// Function to copy the generated password to the clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(displayPassword.value);
        copyMsg.innerHTML = "Copied";
    } catch (e) {
        copyMsg.innerHTML = "Failed";
    }
    // Make the copy message visible
    copyMsg.classList.add("active");

    // Remove the copy message after 2 seconds
    setTimeout(function () {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Function to handle checkbox changes and update checkCount
function handleCheckbox() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // Special case: ensure password length is at least as many as the checked boxes
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlide();
    }
}

// Add event listeners to all checkboxes
allCheckbox.forEach(function (checkbox) {
    checkbox.addEventListener("click", handleCheckbox);
});

// Add event listener to the slider
slideHandler.addEventListener("input", function (e) {
    passwordLength = e.target.value;
    handleSlide();
});

// Add event listener to the copy button
copy.addEventListener("click", function () {
    console.log("aa");
    if (displayPassword.value) {
        copyContent();
    }
});

// Add event listener to the generate password button
generateButton.addEventListener("click", function () {
    // Return if no checkboxes are checked
    if (checkCount <= 0) return;

    // Ensure password length is at least as many as the checked boxes
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlide();
    }

    password = "";

    // Array to store functions for generating password characters
    let funcArr = [];
    if (uppercase.checked) funcArr.push(generateUpperCase);
    if (lowercase.checked) funcArr.push(generateLowerCase);
    if (number.checked) funcArr.push(generateNumber);
    if (symbol.checked) funcArr.push(generateSymbol);

    // Ensure each selected type of character is included at least once
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill the remaining length of the password with random characters from the selected types
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIndex = getRndInteger(0, funcArr.length - 1);
        password += funcArr[randomIndex]();
    }

    // Shuffle the password to ensure randomness
    password = shuffle(Array.from(password));
    displayPassword.value = password;
    calculateStrength();
});
