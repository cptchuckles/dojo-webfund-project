class MinefieldCell extends HTMLButtonElement {
  /// Callback: Function(Array) -> Void
  emitPressed = (arr) => { return; };
  /// Callback: Function(Void) -> Void:
  emitFlagged = () => { return; };

  hasMine = false;
  flagged = false;
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

  connectPressed(cb) {
    this.emitPressed = cb;
  }

  flag(force) {
    if (this.isDisabled()) {
      return;
    }
    this.flagged = force || !this.flagged;
    this.classList.toggle("flagged", this.flagged);
    this.emitFlagged();
  }

  connectFlagged(cb) {
    this.emitFlagged = cb;
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
    if (this.isDisabled() || this.flagged) {
      return;
    }
    this.disable();
    this.processNeighbors();
  }

  setCellCoord(row, col) {
    this.cell.row = row;
    this.cell.col = col;
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

class HighScore extends HTMLElement {
  static place = 0;

  name = "";
  time = Infinity;

  constructor(name, time) {
    super();
    this.name = name;
    this.time = time;
  }

  connectedCallback() {
    HighScore.place++;

    if (this.hasAttribute("name")) {
      this.name = this.getAttribute("name");
    }

    if (this.hasAttribute("time")) {
      this.time = Number(this.getAttribute("time"));
    }

    const scoreTemplate = document.getElementById("high-score");
    const scoreContent = scoreTemplate.content.cloneNode(true);

    const placeTag = scoreContent.children[0];
    const nameTag = scoreContent.children[1];
    const timeTag = scoreContent.children[2];

    placeTag.textContent = String(HighScore.place) + ".";
    nameTag.textContent = this.name;
    timeTag.textContent = String(this.time);

    this.appendChild(scoreContent);
  }
}
customElements.define("high-score", HighScore);
