class MinefieldCell extends HTMLButtonElement {
  /// Callback: Function(Array) -> Void
  emitPressed = (arr) => { return; };

  hasMine = false;
  cell = { row: undefined, col: undefined };

  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", () => this.pressButton());
  }

  disable() {
    this.toggleAttribute("disabled", true);
  }

  isDisabled() {
    return this.getAttribute("disabled");
  }

  setAsMine() {
    this.hasMine = true;
  }

  pressButton() {
    if (this.isDisabled()) {
      return;
    }
    this.disable();
    this.returnNeighbors();
  }

  setCellCoord(row, col) {
    this.cell.row = row;
    this.cell.col = col;
  }

  connectPressed(cb) {
    this.emitPressed = cb;
  }

  returnNeighbors() {
    const neighbors = [];
    const {row, col} = this.cell;
    for (let r=row-1; r<=row+1; r++) {
      for (let c=col-1; c<=col+1; c++) {
        if (r===row && c===col) {
          continue;
        }
        neighbors.push({row: r, col: c});
      }
    }
    this.emitPressed(neighbors);
  }
}

customElements.define("minefield-cell", MinefieldCell, { extends: "button" });
