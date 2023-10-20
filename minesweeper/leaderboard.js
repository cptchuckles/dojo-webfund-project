// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const scores = [];
const leaderboard = document.getElementById("leaderboard");

let app = {};
let db = {};

function connectToFirestore() {
  const sekrit = {
    "iv": "iP2H+EVYuin8JNhlJAbCxA==",
    "v": 1,
    "iter": 10000,
    "ks": 128,
    "ts": 64,
    "mode": "ccm",
    "adata": "",
    "cipher": "aes",
    "salt": "PbidYKlG2rk=",
    "ct": "fY2VcQz98sSdCQdsIARY9dH9XSl7s9abx76hLsxwfDbMOd2gVbdDUa1Xs3jG2zo="
  };

  const password = prompt("Unlock the high scores table:");

  try {
    const apiKey = sjcl.decrypt(password, JSON.stringify(sekrit));

    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: "dojo-leaderboards.firebaseapp.com",
      projectId: "dojo-leaderboards",
      storageBucket: "dojo-leaderboards.appspot.com",
      messagingSenderId: "571011663408",
      appId: "1:571011663408:web:28283e6a4ab2f82780cff5"
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    onGameWin = () => {
      if (window.game.isWon) {
        recordHighScore();
      }
    }
  }
  catch(e) {
    console.error("Could not connect to Firebase:", e);
    alert("Playing offline");
    leaderboard.innerHTML = "<h3>Could not connect to Firebase</h3>";
  }
}

function clearLeaderboard() {
  Array.from(leaderboard.children).forEach(child => child.remove());
}

async function fetchHighScores(scoresArray) {
  try {
    const querySnapshot = await getDocs(collection(db, "minesweeper-scores"));
    querySnapshot.forEach(doc => {
      const { name, time } = doc.data();
      scoresArray.push(new HighScore(name, time));
    });
  }
  catch(e) {
    return false;
  }

  scoresArray.sort((a,b) => a.time - b.time);

  return true;
}

async function recordHighScore() {
  const name = prompt("You win! Record your high score:");

  try {
    const docRef = await addDoc(collection(db, "minesweeper-scores"), {
      name: name,
      time: window.game.timer,
    });
  }
  catch(e) {
    console.error("Error recording high score:", e);
    return;
  }

  await updateLeaderboard();
}

async function updateLeaderboard() {
  if (!await fetchHighScores(scores)) {
    return;
  }

  clearLeaderboard();

  scores.forEach(score => {
    leaderboard.appendChild(score);
  });

  while (scores.length > 0) {
    scores.pop();
  }
}

connectToFirestore();
updateLeaderboard();
