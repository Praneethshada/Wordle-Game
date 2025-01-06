document.addEventListener("DOMContentLoaded", () => {
    let word; // The word to guess
    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    // Generate a random word for the game
    function getNewWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        word = words[randomIndex].toLowerCase();
    }

    // Get the current word array
    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    // Update guessed word with a letter
    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    // Determine the color of a tile
    function getTileColor(letter, index, wordFrequency) {
        if (wordFrequency[letter] === undefined || wordFrequency[letter] <= 0) {
            return "rgb(58, 58, 60)"; // Grey
        }

        const isCorrectPosition = letter === word.charAt(index);

        if (isCorrectPosition) {
            wordFrequency[letter] -= 1; // Decrement count for this letter
            return "rgb(83, 141, 78)"; // Green
        }

        wordFrequency[letter] -= 1; // Decrement count for this letter
        return "rgb(181, 159, 59)"; // Yellow
    }

    // Update keyboard colors
    function updateKeyColor(key, color) {
        const currentColor = key.style.backgroundColor;
        if (
            currentColor === "rgb(83, 141, 78)" || // Green has precedence
            (currentColor === "rgb(181, 159, 59)" && color === "rgb(58, 58, 60)") // Yellow has precedence over Grey
        ) {
            return;
        }
        key.style.backgroundColor = color;
    }

    // Handle word submission
    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("Word must be 5 letters");
            return;
        }

        const currentWord = currentWordArr.join("").toLowerCase();

        if (!words.includes(currentWord)) {
            window.alert("Word is not recognised!");
            return;
        }

        // Create a frequency map for the target word
        const wordFrequency = {};
        for (const char of word) {
            wordFrequency[char] = (wordFrequency[char] || 0) + 1;
        }

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200; // Animation delay
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index, wordFrequency);
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;

                const key = Array.from(keys).find(k => k.getAttribute("data-key") === letter);
                if (key) {
                    updateKeyColor(key, tileColor);
                }
            }, index * interval);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
            window.alert("Congratulations! You guessed the word!");
        }

        if (guessedWords.length === 6 && currentWord !== word) {
            window.alert(`Sorry, you have no more guesses! The word was ${word}.`);
        }

        guessedWords.push([]);
    }

    // Create the grid of squares for the game board
    function createSquares() {
        const board = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", index + 1);
            board.appendChild(square);
        }
    }

    // Handle deletion of the last letter
    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();

        if (currentWordArr.length === 0) return; // Prevent deleting from previous guesses

        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace - 1));
        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
    }

    // Reset the game state when retrying
    function handleRetry() {
        guessedWords = [[]];
        availableSpace = 1;
        guessedWordCount = 0;
        getNewWord();

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.textContent = "";
            square.style = "";
        });

        const keys = document.querySelectorAll(".keyboard-row button");
        keys.forEach((key) => {
            key.style = "";
        });
    }

    // Handle physical keyboard input
    function handlePhysicalKeyboardInput(event) {
        const letter = event.key.toLowerCase();

        if (letter === "enter") {
            handleSubmitWord();
            return;
        }

        if (letter === "backspace") {
            handleDeleteLetter();
            return;
        }

        if (/^[a-z]$/.test(letter)) {
            updateGuessedWords(letter);
        }
    }

    // Add event listeners for keyboard buttons
    keys.forEach((key) => {
        key.onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord();
                return;
            }

            if (letter === "del") {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    });

    // Add event listener to the retry icon
    document.getElementById("retry-icon").addEventListener("click", handleRetry);

    // Add event listener for physical keyboard
    document.addEventListener("keydown", handlePhysicalKeyboardInput);
});