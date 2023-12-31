// DOM
let hangmanFrame = document.getElementById("hangman-frame"); 
let returnContent = document.getElementById("return-content");
let incorrectLetters = document.getElementById("incorrect-letters");
let chances = document.getElementById("num-chances");
let message = document.getElementById("final-message");
let startBtn = document.getElementById("start-button");
let score = document.getElementById("score");

// Global Variables
let word;
let grid;
let seen;
let incorrect;
let numChances = 0;
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
    incorrectLetters.textContent = "";
    chances.textContent = 10;
    message.textContent = "";
    grid = [];
    seen = [];
    incorrect = [];
    numChances = 10;
    gameWon = false;
    gameLost = false;

    // Reset the underscores
    for (let i = 0; i < word.length; i++) {
        grid.push("_");
    }
    returnContent.textContent = grid.join(" ");

    // Initialise the frames
    hangmanFrame.src = "assets/frame0.png";
}

// Gets the letter that the user clicks on
addEventListener("keydown", (e) => {
    if (gameWon == false && gameLost == false && isAlpha(e.key) && word) {
        // Gets every position of the chosen letter, if in word
        let allPositions = [];
        let letter = (e.key).toLowerCase();
        if (word.includes(letter)) {
            allPositions = [...word.matchAll(new RegExp(letter, 'gi'))].map(a => a.index);
        }

        // If the letter is not found in the word, a chance is decremented
        if (allPositions.length == 0 && !seen.includes(letter)) {
            hangmanFrame.src = "assets/frame" + (10 - numChances + 1) +  ".png";
            numChances--;
            chances.textContent = numChances;
        }
        
        // If the letter is in the word, it will be displayed
         // Otherwise, it will be added to the incorrect letters
        if (word.includes(letter)) {
            for (let i = 0; i < allPositions.length; i++) {
                grid[allPositions[i]] = letter;
            }
        } else if (!incorrect.includes(letter)) {
            incorrect.push(letter);
            
            let incorrectLetter = document.createElement('span');
            incorrectLetter.textContent = letter;
            incorrectLetters.append(incorrectLetter);
        }
        
        returnContent.textContent = grid.join(" ");
        seen.push(letter);

        // If the user ran out of chances, the game is over
        if (numChances == 0) {
            gameLost = true;
            endGame();
        } 

        // If the user won, the game is over
        if (grid.indexOf("_") == -1) {
            gameWon = true;
            points += numChances;
            score.textContent = points;
            endGame();
        } 
    } 
})

function isAlpha(ch) {
    return (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") && ch.length == 1;
}

function endGame() {
    let losingMessage = "The correct word was: ";
    let winningMessage = "You Won!";
    if (gameLost) {
        message.textContent = losingMessage;
        let boldedWord = document.createElement('span');
        boldedWord.textContent = word;
        message.append(boldedWord);
        points = 0;
        score.textContent = points;
    } else {
        message.textContent = winningMessage;
    }
    startBtn.disabled = false;
}