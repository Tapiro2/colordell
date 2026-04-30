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

let board = []; // מערך שישמור את האלמנטים (התאים) של הלוח עצמו ב-DOM
let boardValues = []; // מערך שישמור את הערכים (למשל צבעים) שנבחרו לכל תא

let currentRow = 0; // השורה הנוכחית שהשחקן נמצא בה
let currentCol = 0; // העמודה הנוכחית שהשחקן נמצא בה

let target = []; // המטרה - קומבינציית הצבעים שהשחקן צריך לנחש

function generateTarget() { // פונקציה שיוצרת את קומבינציית המטרה באקראי
    let shuffled = [...colors]; // יוצרת עותק של מערך הצבעים כדי לא לשנות את המקור

    for (let i = shuffled.length - 1; i > 0; i--) { // לולאת ערבוב (אלגוריתם Fisher-Yates)
        let j = Math.floor(Math.random() * (i + 1)); // בוחר אינדקס אקראי בין 0 ל-i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // מחליף בין שני איברים במערך
    }

    target = shuffled.slice(0, COLS); // לוקח את מספר הצבעים לפי מספר העמודות ושומר כמטרה
    console.log("TARGET:", target); // מדפיס לקונסול את המטרה (לבדיקות)
}

function createBoard() { // פונקציה שיוצרת את הלוח על המסך
    const boardDiv = document.getElementById("board"); // מביא את האלמנט הראשי של הלוח מה-HTML

    for (let r = 0; r < ROWS; r++) { // עובר על כל השורות
        const row = document.createElement("div"); // יוצר אלמנט div חדש לשורה
        row.className = "row"; // נותן לשורה מחלקת CSS בשם row

        board[r] = []; // יוצר מערך חדש עבור התאים של השורה
        boardValues[r] = []; // יוצר מערך חדש עבור הערכים של השורה

        for (let c = 0; c < COLS; c++) { // עובר על כל העמודות בשורה
            const cell = document.createElement("div"); // יוצר תא חדש
            cell.className = "cell"; // נותן לתא מחלקת CSS בשם cell

            boardValues[r][c] = null; // מאתחל את הערך של התא ל-null (ריק)

            row.appendChild(cell); // מוסיף את התא לשורה
            board[r][c] = cell; // שומר את האלמנט עצמו במערך board
        }

        boardDiv.appendChild(row); // מוסיף את השורה ללוח הראשי ב-HTML
    }
}

function createPalette() { // פונקציה שיוצרת את פלטת הצבעים לבחירה
    const palette = document.getElementById("color-palette"); // לוקחת את האלמנט שבו יוצגו הצבעים

    colors.forEach(color => { // עוברת על כל הצבעים במערך colors
        const div = document.createElement("div"); // יוצרת אלמנט חדש לכל צבע
        div.className = "color-option"; // מוסיפה מחלקת CSS לעיצוב
        div.style.backgroundColor = color; // מגדירה את צבע הרקע של האלמנט

        div.addEventListener("click", () => { // מוסיפה אירוע לחיצה על הצבע
            if (currentCol >= COLS) return; // אם השורה מלאה - לא עושה כלום

            const cell = board[currentRow][currentCol]; // לוקחת את התא הנוכחי בלוח

            boardValues[currentRow][currentCol] = color; // שומרת את הצבע במערך הערכים
            cell.style.backgroundColor = color; // צובעת את התא בצבע שנבחר

            currentCol++; // עוברת לעמודה הבאה
        });

        palette.appendChild(div); // מוסיפה את הצבע לפלטה במסך
    });
}

document.getElementById("delete-btn").addEventListener("click", () => { // אירוע לחיצה על כפתור מחיקה
    if (currentCol <= 0) return; // אם אין מה למחוק - יוצא

    currentCol--; // חוזר תא אחד אחורה

    const cell = board[currentRow][currentCol]; // לוקח את התא שצריך למחוק

    boardValues[currentRow][currentCol] = null; // מאפס את הערך במערך
    cell.style.backgroundColor = ""; // מסיר את הצבע מהתא

    cell.classList.remove("correct", "wrong-place", "not-exist"); // מסיר מחלקות של תוצאה (אם היו)
});

function checkGuess() { // פונקציה שבודקת את הניחוש של השחקן
    const guess = boardValues[currentRow]; // לוקחת את הניחוש מהשורה הנוכחית

    if (guess.includes(null)) { // בודקת אם יש תאים ריקים
        alert("Fill all cells!"); // מציגה הודעה למשתמש
        return; // עוצרת את הבדיקה
    }

    let tempTarget = [...target]; // עותק של המטרה כדי לא לשנות את המקור
    let tempGuess = [...guess]; // עותק של הניחוש
    let result = Array(COLS).fill("not-exist"); // מערך תוצאות - ברירת מחדל: לא קיים

    for (let i = 0; i < COLS; i++) { // מעבר ראשון - בדיקת התאמה מדויקת
        if (tempGuess[i] === tempTarget[i]) { // אם הצבע במקום הנכון
            result[i] = "correct"; // מסמן כנכון
            tempGuess[i] = null; // מאפס כדי שלא ייבדק שוב
            tempTarget[i] = null; // מאפס גם במטרה
        }
    }

    for (let i = 0; i < COLS; i++) { // מעבר שני - בדיקת צבע במקום לא נכון
        if (!tempGuess[i]) continue; // אם כבר טופל - מדלג

        const index = tempTarget.indexOf(tempGuess[i]); // מחפש את הצבע במטרה

        if (index !== -1) { // אם נמצא
            result[i] = "wrong-place"; // מסמן כמיקום שגוי
            tempTarget[index] = null; // מאפס כדי לא להשתמש שוב
        }
    }

    for (let i = 0; i < COLS; i++) { // מעבר על כל התאים בשורה
        board[currentRow][i].classList.add(result[i]); // מוסיף מחלקת CSS לפי התוצאה
    }

    if (result.every(r => r === "correct")) { // בודק אם כל התאים נכונים
        setTimeout(() => alert("🎉 You Win!"), 200); // מציג הודעת ניצחון
        return; // מסיים את המשחק
    }

    currentRow++; // עובר לשורה הבאה
    currentCol = 0; // מאפס את העמודה להתחלה

    if (currentRow >= ROWS) { // אם נגמרו השורות (הפסד)
        setTimeout(() => { // דחייה קטנה כדי להציג קודם את התוצאה
            alert("💀 Game Over"); // הודעת הפסד

            const answerDiv = document.getElementById("answer"); // אלמנט להצגת התשובה
            answerDiv.innerHTML = "Answer:<br>"; // כותרת

            target.forEach(color => { // מעבר על צבעי המטרה
                const box = document.createElement("div"); // יצירת קובייה קטנה
                box.style.display = "inline-block"; // הצגה בשורה
                box.style.width = "30px"; // רוחב
                box.style.height = "30px"; // גובה
                box.style.margin = "4px"; // רווח
                box.style.borderRadius = "5px"; // פינות מעוגלות
                box.style.backgroundColor = color; // צבע

                answerDiv.appendChild(box); // מוסיף לתצוגה
            });

            document.getElementById("restart-btn").style.display = "inline-block"; // מציג כפתור ריסט
            document.getElementById("color-palette").style.display = "none"; // מסתיר פלטת צבעים
            document.getElementById("delete-btn").style.display = "none"; // מסתיר מחיקה
            document.getElementById("submit-guess").style.display = "none"; // מסתיר שליחה
        }, 200);
    }
}

document.getElementById("submit-guess").addEventListener("click", checkGuess); // חיבור כפתור בדיקה לפונקציה

document.getElementById("restart-btn").addEventListener("click", () => { // אירוע לחיצה על ריסט
    document.getElementById("board").innerHTML = ""; // מנקה את הלוח
    document.getElementById("answer").innerHTML = ""; // מנקה תשובה
    document.getElementById("restart-btn").style.display = "none"; // מסתיר כפתור ריסט

    board = []; // מאפס את מערך הלוח
    boardValues = []; // מאפס את הערכים
    currentRow = 0; // מאפס שורה
    currentCol = 0; // מאפס עמודה

    createBoard(); // יוצר לוח חדש
    generateTarget(); // יוצר מטרה חדשה
});

window.onload = () => { // כשהדף נטען
    createBoard(); // יוצר את הלוח
    createPalette(); // יוצר את פלטת הצבעים
    generateTarget(); // מגריל מטרה חדשה
};