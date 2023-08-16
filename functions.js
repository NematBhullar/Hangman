// DOM
let returnContent = document.getElementById("return-content");
let chances = document.getElementById("num-chances");
let message = document.getElementById("final-message");
let startBtn = document.getElementById("start-button");
let score = document.getElementById("score");

// Global Variables
let word;
let grid;
let seen;
let numChances;
let gameWon = false;
let gameLost = false;
let points = 0;

let link = 'https://random-word-api.herokuapp.com/word';

// Starts the game
startBtn.addEventListener("click", (e) => {
    getNewWord();
    e.target.disabled = true;
})

// Returns a word from the API
async function getNewWord() {
    const response = await fetch(link);
    const wordJSON = await response.json();
    word = wordJSON[0];
    createGame();
};

// Initialises a new game
function createGame() {
    returnContent.textContent = "";
    chances.textContent = 10;
    message.textContent = "";
    grid = [];
    seen = [];
    numChances = 10;
    gameWon = false;
    gameLost = false;

    for (let i = 0; i < word.length; i++) {
        grid.push("_");
    }
    returnContent.textContent = grid.join(" ");
}

// Gets the letter that the user clicks on
addEventListener("keydown", (e) => {
    if (gameWon == false && gameLost == false && isAlpha(e.key) && word) {
        // Gets every position of the chosen letter, if in word
        let allPositions = [];
        if (word.includes(e.key)) {
            allPositions = [...word.matchAll(new RegExp(e.key, 'gi'))].map(a => a.index);
        }

        // If the letter is not found in the word, a chance is decremented
        if (allPositions.length == 0 && !seen.includes(e.key)) {
            numChances--;
            chances.textContent = numChances;
        }
        
        // If the letter is in the word, it will be displayed
        if (word.includes(e.key)) {
            for (let i = 0; i < allPositions.length; i++) {
                grid[allPositions[i]] = e.key;
            }
        } 
        
        returnContent.textContent = grid.join(" ");
        seen.push(e.key);

        // If the user ran out of chances, the game is over
        if (numChances == 0) {
            gameLost = true;
            endGame();
        } 

        // If the user won, the game is over
        if (grid.indexOf("_") == -1) {
            gameWon = true;
            points += word.length;
            score.textContent = points;
            endGame();
        } 
    } 
})

function isAlpha(ch) {
    return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z";
}

function endGame() {
    let losingMessage = "The correct word was: " + word;
    let winningMessage = "You Won!";
    message.textContent = gameLost ? losingMessage : winningMessage;
    startBtn.disabled = false;
}