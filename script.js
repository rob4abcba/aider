// Game settings
const gridWidth = 10;
const gridHeight = 10;
const numMines = 10;

// Game state
let grid = [];
let revealedCells = [];
let flaggedCells = [];
let minesRemaining = numMines;
let gameOver = false;

// Create the game grid
function createGrid() {
    for (let i = 0; i < gridHeight; i++) {
        grid[i] = [];
        for (let j = 0; j < gridWidth; j++) {
            grid[i][j] = {
                mine: false,
                revealed: false,
                flagged: false,
                adjacentMines: 0
            };
        }
    }
}

// Randomly place mines on the grid
function placeMines() {
    for (let i = 0; i < numMines; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridWidth);
            y = Math.floor(Math.random() * gridHeight);
        } while (grid[y][x].mine);
        grid[y][x].mine = true;
    }
}

// Calculate the number of adjacent mines for each cell
function calculateAdjacentMines() {
    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            if (grid[i][j].mine) continue;
            let adjacentMines = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    let adjacentX = j + x;
                    let adjacentY = i + y;
                    if (adjacentX < 0 || adjacentX >= gridWidth || adjacentY < 0 || adjacentY >= gridHeight) continue;
                    if (grid[adjacentY][adjacentX].mine) adjacentMines++;
                }
            }
            grid[i][j].adjacentMines = adjacentMines;
        }
    }
}

// Reveal a cell
function revealCell(x, y) {
    if (grid[y][x].revealed || grid[y][x].flagged) return;
    grid[y][x].revealed = true;
    revealedCells.push({ x, y });
    if (grid[y][x].mine) {
        gameOver = true;
        alert("Game Over!");
    } else if (grid[y][x].adjacentMines === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let adjacentX = x + j;
                let adjacentY = y + i;
                if (adjacentX < 0 || adjacentX >= gridWidth || adjacentY < 0 || adjacentY >= gridHeight) continue;
                revealCell(adjacentX, adjacentY);
            }
        }
    }
}

// Flag a cell
function flagCell(x, y) {
    if (grid[y][x].revealed) return;
    grid[y][x].flagged = !grid[y][x].flagged;
    if (grid[y][x].flagged) {
        flaggedCells.push({ x, y });
        minesRemaining--;
    } else {
        flaggedCells = flaggedCells.filter(cell => cell.x !== x || cell.y !== y);
        minesRemaining++;
    }
}

// Reset the game
function resetGame() {
    grid = [];
    revealedCells = [];
    flaggedCells = [];
    minesRemaining = numMines;
    gameOver = false;
    createGrid();
    placeMines();
    calculateAdjacentMines();
    renderGrid();
}

// Render the game grid
function renderGrid() {
    const gameGrid = document.querySelector(".game-grid");
    gameGrid.innerHTML = "";
    for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (grid[i][j].revealed) {
                cell.classList.add("revealed");
                if (grid[i][j].mine) {
                    cell.textContent = "";
                } else if (grid[i][j].adjacentMines > 0) {
                    cell.textContent = grid[i][j].adjacentMines;
                }
            } else if (grid[i][j].flagged) {
                cell.classList.add("flagged");
            }
            cell.addEventListener("click", () => {
                if (gameOver) return;
                revealCell(j, i);
                renderGrid();
            });
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (gameOver) return;
                flagCell(j, i);
                renderGrid();
            });
            gameGrid.appendChild(cell);
        }
    }
    document.getElementById("mines-remaining").textContent = `Mines remaining: ${minesRemaining}`;
}

// Initialize the game
createGrid();
placeMines();
calculateAdjacentMines();
renderGrid();

// Add event listener to reset button
document.getElementById("reset-button").addEventListener("click", resetGame);
