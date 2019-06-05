let origBoard;
const HUMAN_PLAYER = "O";
const AI_PLAYER = "X";
let gameWon = false;
let height = window.screen.height;
var difficulty = 3;
var rad = document.myForm.myRadios;
var prev = null;
console.log(height);

// pentru schimbarea dificultatii .onclick pe butoane
for (var i = 0; i < rad.length; i++) {
  rad[i].onclick = function() {
    prev ? console.log(prev.value) : null;
    if (this !== prev) {
      prev = this;
    }
    if (difficulty != this.value) {
      difficulty = this.value;
      onStartGame();
    }
  };
}
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.getElementsByClassName("cell");
onStartGame();

//reseteaza jocul
function onStartGame() {
  // console.log('Starting Game');
  document.querySelector(".end-game").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  gameWon = false;
  // console.table(origBoard);
  // console.log(cells);
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", onTurnClick, false);
  }
}

//daca atunci cand dai click cell-ul e empty da call la onTurn
function onTurnClick(e) {
  // console.log(e.target.id);
  const { id: squareId } = e.target;
  if (typeof origBoard[squareId] === "number") {
    onTurn(squareId, HUMAN_PLAYER);
    if (onCheckGameTie() == false && gameWon == false) {
      onTurn(botPicksSpot(), AI_PLAYER);
    }
  }
}

//schimba innerHTML de la square-ul pe care s-a dat click cu fata meaa
function onTurn(squareId, player) {
  origBoard[squareId] = player;
  let isGameWon = onCheckWin(origBoard, player);
  // console.log(isGameWon)
  if (isGameWon) {
    onGameOver(isGameWon);
  }
  if (player == HUMAN_PLAYER) {
    document.getElementById(squareId).innerHTML = "X";
  } else
    document.getElementById(squareId).innerHTML =
      "<img src='fataDeProst.png' height='90vh' width='90vh' style='padding-top:10px;'>";
}

//bag pula ca merge dar nu prea
function onCheckWin(board, player) {
  let plays = board.reduce((a, e, i) => {
    return e === player ? a.concat(i) : a;
  }, []);
  gameWon = false;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

// screeenul de gameover
function onGameOver({ index, player }) {
  const result = player === HUMAN_PLAYER ? "You Win" : "You Lose";
  onDeclareWinner(result);
  for (let i of winCombos[index]) {
    const color = player === HUMAN_PLAYER ? "#CCCC99" : "rgb(24, 23, 23)";
    document.getElementById(i).style.backgroundColor = color;
    document.getElementById(i).style.transition = "background .2s ease-out";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", onTurnClick, false);
  }
}

function onDeclareWinner(who) {
  // console.log('Result: ', who);
  if (height > 860) {
    document.querySelector(".end-game").style.display = "block";
    document.querySelector(".end-game .text").innerText = `Result: ${who}`;
  }
}

/**
 * Bot moves
 */

function onCheckGameTie() {
  if (emptySquares().length === 0 && gameWon == false) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "rgb(9, 44, 38)";
      document.getElementById(i).style.transition = "background .2s ease-out";
      cells[i].removeEventListener("click", onTurnClick, false);
    }
    onDeclareWinner("A Tie");
    return true;
  } else {
    return false;
  }
}

function emptySquares() {
  return origBoard.filter(item => typeof item === "number");
}

function botPicksSpot() {
  if (difficulty == 3) {
    return minimax(origBoard, AI_PLAYER).index;
  }
  if (difficulty == 2 && gameWon == false) {
    //  let move = emptySquares();
    // let x = move.length;
    //  let i = Math.floor(Math.random() * x + 0);
    // return move[i];
    return mediumMax(origBoard, AI_PLAYER).index;
  }
  if (difficulty == 1 && gameWon == false) {
    return emptySquares()[0];
  }
}

function minimax(newBoard, player) {
  let availableSpots = emptySquares();

  if (onCheckWin(newBoard, HUMAN_PLAYER)) {
    return { score: -10 };
  } else if (onCheckWin(newBoard, AI_PLAYER)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === AI_PLAYER) {
      let result = minimax(newBoard, HUMAN_PLAYER);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, AI_PLAYER);
      move.score = result.score;
    } // end of if/else block

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  } // end of for look

  let bestMove;

  if (player === AI_PLAYER) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    } // end of for loop
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
  console.log(moves[bestMove]);
} // end of minimax func()

function mediumMax(newBoard, player) {
  let availableSpots = emptySquares();

  if (onCheckWin(newBoard, HUMAN_PLAYER)) {
    return { score: -10 };
  } else if (onCheckWin(newBoard, AI_PLAYER)) {
    return { score: 10 };
  } else if (availableSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === AI_PLAYER) {
      let result = minimax(newBoard, HUMAN_PLAYER);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, AI_PLAYER);
      move.score = result.score;
    } // end of if/else block

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  } // end of for look
  let bestMove;

  if (player === AI_PLAYER) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length - 1; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    } // end of for loop
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length - 1; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
  console.log(moves[bestMove]);
} // end of minimax func()
