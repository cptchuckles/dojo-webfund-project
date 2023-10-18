const minefield = document.getElementById("minefield");

const rows = 16;
const cols = 30;
const mines = 99;

const cells = []

const colorList = [
  "#00a", // 1
  "#060", // 2
  "#a00", // 3
  "#505", // 4
  "#0a0", // 5
  "#b40", // 6
  "#a05", // 7
  "#aa0", // 8
]

let firstBlood = true;
let won = false;
let winCheck = 0;

function buildGrid() {
  for (let r=0; r<rows; r++) {
    const row = document.createElement("div");
    minefield.appendChild(row);
    row.classList.add("cell-row");

    for (let c=0; c<cols; c++) {
      const cell = document.createElement("button", { is: "minefield-cell" });
      row.appendChild(cell);
      cell.setCellCoord(r, c);
      cell.connectPressed(onCellButtonPressed);
      cells.push(cell);
    }
  }
}

function populateMines(ignore = -1) {
  for (let m=0; m<mines; m++) {
    let idx = Math.floor(Math.random() * rows * cols);
    while (idx === ignore || cells[idx].hasMine) {
      // Choose again
      idx = Math.floor(Math.random() * rows * cols);
    }
    cells[idx].setAsMine();
    cells[idx].connectPressed(gameOver);
  }
}

function gameOver() {
  alert("YOU DIED");
  this.style.backgroundColor = "var(--exploded-color)";
  cells.forEach(cell => cell.disable());
}

function countDownToWinCheck() {
  winCheck--;
  if (winCheck === 0) {
    checkWinCondition();
  }
}

function checkWinCondition() {
  if (won) {
    return;
  }

  for (const cell of cells) {
    if (!cell.hasMine && !cell.isDisabled()) {
      return;
    }
  }

  won = true;

  for (const cell of cells) {
    cell.flag(cell.hasMine);
    cell.disable();
  }
  setTimeout(() => alert("you win!!!1"), 0);
}

function onCellButtonPressed(neighbors) {
  if (firstBlood) {
    firstBlood = false;
    const {row, col} = this.cell;
    const idx = row * cols + col;
    populateMines(idx);
  }

  neighbors = neighbors.filter(n => {
    return (0 <= n.row && n.row < rows) && (0 <= n.col && n.col < cols);
  }).map(n => {
    const idx = n.row * cols + n.col;
    return cells[idx];
  });

  let neighborMines = 0;

  for (let neighbor of neighbors) {
    if (neighbor.hasMine) {
      neighborMines++;
    }
  }

  if (neighborMines == 0) {
    for (let neighbor of neighbors) {
      if (neighbor.isDisabled()) {
        continue;
      }
      setTimeout(() => neighbor.pressButton(), 0);
    }
  }
  else {
    this.setNumberText(neighborMines);
  }

  winCheck++;
  setTimeout(() => countDownToWinCheck());
}

buildGrid();
