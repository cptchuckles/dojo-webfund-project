if ("content" in document.createElement("template")) {
  const cellTemplate = document.getElementById("cell-template");

  class MinefieldCell extends HTMLElement {
    static cells = 0;

    /// Callback: Function(Array) -> Void
    emitPressed = (arr) => { return; };

    hasMine = false;

    constructor() {
      super();
    }

    connectedCallback() {
      const clone = cellTemplate.content.cloneNode(true);

      const div = clone.children[0];
      div.setAttribute("data-cell", String(MinefieldCell.cells));

      const button = div.children[0];
      button.addEventListener("click", () => this.pressButton());

      this.appendChild(clone);

      MinefieldCell.cells++;
    }

    disconnectedCallback() {
      MinefieldCell.cells--;
    }

    disable() {
      this.getButton().setAttribute("disabled", true);
    }

    isDisabled() {
      return this.getButton().getAttribute("disabled");
    }

    getButton() {
      return this.children[0].children[0];
    }

    pressButton() {
      if (this.isDisabled()) {
        return;
      }
      this.disable();
      this.returnNeighbors();
    }

    setCellCoord(row, col) {
      const cell = [row, col].join(",");
      this.setAttribute("data-cell", cell);
    }

    connectPressed(cb) {
      this.emitPressed = cb;
    }

    returnNeighbors() {
      const neighbors = [];
      const [row, col] = this.getAttribute("data-cell").split(",").map(n => Number(n));
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

  customElements.define("minefield-cell", MinefieldCell);
}
else {
  console.error("HTML Templates are not supported");
}
