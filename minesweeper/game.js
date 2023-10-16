const minefield = document.getElementById("minefield");

const rows = 16;
const cols = 30;

for (let r=0; r<rows; r++) {
  const row = document.createElement("div");
  row.classList.add("cell-row");
  minefield.appendChild(row);

  for (let c=0; c<cols; c++) {
    const cell = document.createElement("minefield-cell");
    row.appendChild(cell);
  }
}
