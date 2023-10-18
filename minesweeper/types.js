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
    this.addEventListener("contextmenu", ev => {
      ev.preventDefault();
      this.flag();
    })
  }

  flag() {
    if (this.isDisabled()) {
      return;
    }
    this.classList.toggle("flagged");
  }

  isFlagged() {
    return this.classList.contains("flagged");
  }

  setNumberText(n, colorList = []) {
    this.textContent = String(n);
    this.style.color = colorList[n-1] || "black";
  }

  disable() {
    this.toggleAttribute("disabled", true);
  }

  isDisabled() {
    return this.getAttribute("disabled") !== null;
  }

  setAsMine() {
    this.hasMine = true;
    this.classList.add("has-mine");
  }

  pressButton() {
    if (this.isDisabled() || this.isFlagged()) {
      return;
    }
    this.disable();
    this.processNeighbors();
  }

  setCellCoord(row, col) {
    this.cell.row = row;
    this.cell.col = col;
  }

  connectPressed(cb) {
    this.emitPressed = cb;
  }

  processNeighbors() {
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
