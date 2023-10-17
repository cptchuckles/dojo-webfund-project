const minefield = document.getElementById("minefield");

const rows = 16;
const cols = 30;
const mines = 99;

const cells = []

function buildGrid() {
  for (let r=0; r<rows; r++) {
    const row = document.createElement("div");
    minefield.appendChild(row);
    row.classList.add("cell-row");

    for (let c=0; c<cols; c++) {
      const cell = document.createElement("minefield-cell");
      row.appendChild(cell);
      cell.setCellCoord(r, c);
      cell.connectPressed(onCellButtonPressed);
      cells.push(cell);
    }
  }

  populateMines();
}

function populateMines() {
  for (let m=0; m<mines; m++) {
    let idx = Math.floor(Math.random() * rows * cols);
    while (cells[idx].hasMine) {
      // Choose again
      idx = Math.floor(Math.random() * rows * cols);
    }
    cells[idx].hasMine = true;
    cells[idx].connectPressed(() => alert("YOU DIED"));
  }
}

function onCellButtonPressed(neighbors) {
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
    this.getButton().textContent = String(neighborMines);
  }
}

buildGrid();
