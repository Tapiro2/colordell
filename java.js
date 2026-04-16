const colors = [
  "#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF",
  "#4B0082","#8A2BE2","#A52A2A","#800000","#808000",
  "#008080","#000080","#ADD8E6","#FFD700","#32CD32","#C71585"
];

const ROWS = 6;
const COLS = 5;

let board = [];
let boardValues = [];
let currentRow = 0;
let selectedCell = null;
let target = [];

// 🎯 יצירת קומבינציה רנדומלית
function generateTarget() {
    target = [];
    for (let i = 0; i < COLS; i++) {
        target.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    console.log("TARGET:", target);
}

// 🧱 יצירת לוח
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

            cell.addEventListener("click", () => {
                if (r !== currentRow) return;

                document.querySelectorAll(".cell").forEach(x => x.classList.remove("active"));
                cell.classList.add("active");

                selectedCell = { row: r, col: c, element: cell };
            });

            row.appendChild(cell);
            board[r][c] = cell;
        }

        boardDiv.appendChild(row);
    }
}

// 🎨 פלטת צבעים
function createPalette() {
    const palette = document.getElementById("color-palette");

    colors.forEach(color => {
        const div = document.createElement("div");
        div.className = "color-option";
        div.style.backgroundColor = color;

        div.addEventListener("click", () => {
            if (!selectedCell) return;

            const { row, col, element } = selectedCell;

            boardValues[row][col] = color;
            element.style.backgroundColor = color;
        });

        palette.appendChild(div);
    });
}

// 🧹 מחיקה
document.getElementById("delete-btn").addEventListener("click", () => {
    if (!selectedCell) return;

    const { row, col, element } = selectedCell;

    boardValues[row][col] = null;
    element.style.backgroundColor = "";
});

// 🔒 נעילת שורה
function lockRow(row) {
    board[row].forEach(cell => {
        cell.style.pointerEvents = "none";
    });
}

// 🧠 בדיקה אמיתית (Wordle style)
function checkGuess() {
    const guess = boardValues[currentRow];

    let correct = 0;
    let wrong = 0;

    let tempTarget = [...target];
    let tempGuess = [...guess];

    // מקום נכון
    for (let i = 0; i < COLS; i++) {
        if (tempGuess[i] === tempTarget[i]) {
            correct++;
            tempGuess[i] = null;
            tempTarget[i] = null;
        }
    }

    // צבע נכון לא במקום
    for (let i = 0; i < COLS; i++) {
        if (!tempGuess[i]) continue;

        const index = tempTarget.indexOf(tempGuess[i]);

        if (index !== -1) {
            wrong++;
            tempTarget[index] = null;
        }
    }

    document.getElementById("feedback").innerText =
        `Correct: ${correct} | Wrong place: ${wrong}`;

    console.log("GUESS:", guess);
    console.log("TARGET:", target);

    lockRow(currentRow);

    if (correct === COLS) {
        alert("🎉 You Win!");
        return;
    }

    currentRow++;

    if (currentRow >= ROWS) {
        alert("💀 Game Over");
        console.log("Answer:", target);
    }

    selectedCell = null;
}

// ▶ כפתור בדיקה
document.getElementById("submit-guess").addEventListener("click", checkGuess);

// 🚀 התחלה / ריסט
window.onload = () => {
    createBoard();
    createPalette();
    generateTarget();
};