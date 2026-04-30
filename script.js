const colors = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#AF52DE",
  "#FF2D55",
  "#00C7BE",
  "#8E8E93",
  "#A2845E"
];

const ROWS = 6;
const COLS = 5;

let board = [];
let boardValues = [];

let currentRow = 0;
let currentCol = 0;

let target = [];

function generateTarget() {
    let shuffled = [...colors];

    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    target = shuffled.slice(0, COLS);
    console.log("TARGET:", target);
}

function createBoard() {
    const boardDiv = document.getElementById("board");

    for (let r = 0; r < ROWS; r++) {
        const row = document.createElement("div");
        row.className = "row";

        board[r] = [];
        boardValues[r] = [];

        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";

            boardValues[r][c] = null;

            row.appendChild(cell);
            board[r][c] = cell;
        }

        boardDiv.appendChild(row);
    }
}

function createPalette() {
    const palette = document.getElementById("color-palette");

    colors.forEach(color => {
        const div = document.createElement("div");
        div.className = "color-option";
        div.style.backgroundColor = color;

        div.addEventListener("click", () => {
            if (currentCol >= COLS) return;

            const cell = board[currentRow][currentCol];

            boardValues[currentRow][currentCol] = color;
            cell.style.backgroundColor = color;

            currentCol++;
        });

        palette.appendChild(div);
    });
}

document.getElementById("delete-btn").addEventListener("click", () => {
    if (currentCol <= 0) return;

    currentCol--;

    const cell = board[currentRow][currentCol];

    boardValues[currentRow][currentCol] = null;
    cell.style.backgroundColor = "";

    cell.classList.remove("correct", "wrong-place", "not-exist");
});

function checkGuess() {
    const guess = boardValues[currentRow];

    if (guess.includes(null)) {
        alert("Fill all cells!");
        return;
    }

    let tempTarget = [...target];
    let tempGuess = [...guess];
    let result = Array(COLS).fill("not-exist");

    for (let i = 0; i < COLS; i++) {
        if (tempGuess[i] === tempTarget[i]) {
            result[i] = "correct";
            tempGuess[i] = null;
            tempTarget[i] = null;
        }
    }

    for (let i = 0; i < COLS; i++) {
        if (!tempGuess[i]) continue;

        const index = tempTarget.indexOf(tempGuess[i]);

        if (index !== -1) {
            result[i] = "wrong-place";
            tempTarget[index] = null;
        }
    }

    for (let i = 0; i < COLS; i++) {
        board[currentRow][i].classList.add(result[i]);
    }

    if (result.every(r => r === "correct")) {
        setTimeout(() => alert("🎉 You Win!"), 200);
        return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow >= ROWS) {
        setTimeout(() => {
            alert("💀 Game Over");

            const answerDiv = document.getElementById("answer");
            answerDiv.innerHTML = "Answer:<br>";

            target.forEach(color => {
                const box = document.createElement("div");
                box.style.display = "inline-block";
                box.style.width = "30px";
                box.style.height = "30px";
                box.style.margin = "4px";
                box.style.borderRadius = "5px";
                box.style.backgroundColor = color;

                answerDiv.appendChild(box);
            });

            document.getElementById("restart-btn").style.display = "inline-block";
            document.getElementById("color-palette").style.display = "none";
            document.getElementById("delete-btn").style.display = "none";
            document.getElementById("submit-guess").style.display = "none";
        }, 200);
    }
}

document.getElementById("submit-guess").addEventListener("click", checkGuess);

document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("board").innerHTML = "";
    document.getElementById("answer").innerHTML = "";
    document.getElementById("restart-btn").style.display = "none";

    board = [];
    boardValues = [];
    currentRow = 0;
    currentCol = 0;

    createBoard();
    generateTarget();
});

window.onload = () => {
    createBoard();
    createPalette();
    generateTarget();
};