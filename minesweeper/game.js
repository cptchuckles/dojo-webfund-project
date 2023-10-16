const minefield = document.getElementById("minefield");

const rows = 16;
const cols = 30;

const cells = []

for (let r=0; r<rows; r++) {
  const row = document.createElement("div");
  minefield.appendChild(row);
  row.classList.add("cell-row");

  for (let c=0; c<cols; c++) {
    const cell = document.createElement("minefield-cell");
    row.appendChild(cell);
    cell.setCellCoord(r, c);
    cell.connectPressed(processNeighbors);
    cells.push(cell);
  }
}

function processNeighbors(neighbors) {
  neighbors = neighbors.filter(n => {
    return (0 <= n.row && n.row < rows) && (0 <= n.col && n.col < cols);
  });
  for (let n of neighbors) {
    const idx = n.row * cols + n.col;
    if (cells[idx].isDisabled()) {
      continue;
    }
    console.log(`Pressing button ${n.row},${n.col}`);
    setTimeout(() => cells[idx].pressButton(), 0);
  }
}
