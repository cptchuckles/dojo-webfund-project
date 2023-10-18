const minefield = document.getElementById("minefield");

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

class MinesweeperGame {
  rows = 16;
  cols = 30;
  cells = [];
  finished = false;
  firstBlood = true;
  winCheck = 0;

  mines = 99;
  minesDisplay = document.getElementById("mine-count");
  timer = 0;
  timerDisplay = document.getElementById("timer");

  constructor() {
    this.buildGrid();
    this.updateMinesDisplay();
    this.updateTimerDisplay();
  }

  updateMinesDisplay() {
    this.minesDisplay.textContent = String(this.mines);
  }

  updateMines(delta) {
    this.mines += delta;
    this.updateMinesDisplay();
  }

  updateTimerDisplay() {
    this.timerDisplay.textContent = String(this.timer);
  }

  startTimer() {
    setTimeout(() => this.timerTick(), 1000);
  }

  timerTick() {
    if (this.finished || game !== this) {
      return;
    }
    this.timer++;
    this.updateTimerDisplay();
    setTimeout(() => this.timerTick(), 1000);
  }

  buildGrid() {
    for (let r=0; r<this.rows; r++) {
      const row = document.createElement("div");
      minefield.appendChild(row);
      row.classList.add("cell-row");

      for (let c=0; c<this.cols; c++) {
        const cell = document.createElement("button", { is: "minefield-cell" });
        row.appendChild(cell);
        cell.setCellCoord(r, c);
        cell.connectPressed(this.onCellPressed);
        cell.connectFlagged(this.onCellFlagged);
        this.cells.push(cell);
      }
    }
  }

  populateMines(ignore = -1) {
    let ignores = []
    if (ignore > 0) {
      for (let r=-1; r<=1; r++) {
        for (let c=-1; c<=1; c++) {
          let idx = ignore + r*this.cols + c
          if (0 <= idx && idx < this.cells.length) {
            ignores.push(idx);
          }
        }
      }
    }
    for (let m=0; m<this.mines; m++) {
      let idx = Math.floor(Math.random() * this.rows * this.cols);
      while (this.cells[idx].hasMine || ignores.includes(idx)) {
        // Choose again
        idx = Math.floor(Math.random() * this.rows * this.cols);
      }
      this.cells[idx].setAsMine();
      this.cells[idx].connectPressed(this.gameOver);
    }
  }

  gameOver() {
    alert("YOU DIED");
    this.style.backgroundColor = "var(--exploded-color)";
    game.cells.forEach(cell => cell.disable());
    game.finished = true;
  }

  countDownToWinCheck() {
    this.winCheck--;
    if (this.winCheck === 0) {
      this.checkWinCondition();
    }
  }

  checkWinCondition() {
    if (this.finished) {
      return;
    }

    for (const cell of this.cells) {
      if (!cell.hasMine && !cell.isDisabled()) {
        return;
      }
    }

    this.finished = true;

    for (const cell of this.cells) {
      cell.flag(cell.hasMine, true);
      cell.disable();
    }

    this.updateMines(-this.mines);
    setTimeout(() => alert("you win!!!1"), 0);
  }

  onCellPressed(neighbors) {
    if (game.firstBlood) {
      game.firstBlood = false;
      const {row, col} = this.cell;
      const idx = row * game.cols + col;
      game.populateMines(idx);
      game.startTimer();
    }

    neighbors = neighbors.filter(n => {
      return (0 <= n.row && n.row < game.rows) && (0 <= n.col && n.col < game.cols);
    }).map(n => {
      const idx = n.row * game.cols + n.col;
      return game.cells[idx];
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

    game.winCheck++;
    setTimeout(() => game.countDownToWinCheck());
  }

  onCellFlagged() {
    game.updateMines(this.flagged ? -1 : 1);
  }
}

function newGame() {
  Array.from(document.getElementById("minefield").childNodes)
       .forEach(child => child.remove());
  game = new MinesweeperGame();
}

let game = new MinesweeperGame();

document.getElementById("reset").addEventListener("click", () => newGame());
