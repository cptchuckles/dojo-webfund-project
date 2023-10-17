const minefield = document.getElementById("minefield");

const rows = 16;
const cols = 30;
const mines = 99;

const cells = []

let firstBlood = true;

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
  // disable clicking or something
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
    this.textContent = String(neighborMines);
  }
}

buildGrid();
