'use strict';

// Variables
const TIC = 'ch';
const TAC = 'r';

const FIRST_PLAYER = TIC;
let gameMoves = [];
let timeMachine = [];

const restartButton = document.querySelector('.restart-btn');
const redoButton = document.querySelector('.redo-btn');
const undoButton = document.querySelector('.undo-btn');
const wonTitle = document.querySelector('.won-title');
const wonMessage = document.querySelector('.won-message');

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

// Functions
function getCurPlayer() {
  if (gameMoves.length === 0) {
    return FIRST_PLAYER;
  } else {
    return gameMoves.slice(-1)[0].player === TIC ? TAC : TIC;
  }
}


function checkUndoRedo() {
  undoButton.disabled = !gameMoves.length;
  redoButton.disabled = !timeMachine.length;
}


function getMove(cell) {
  let currentPlayer = getCurPlayer();
  gameMoves.push({
    player: currentPlayer,
    index: cell.dataset.id
  });
  cell.classList.add(currentPlayer);
  timeMachine = [];
  checkUndoRedo();
  if (gameMoves.length > 4) {
    checkWin(cell, currentPlayer);
  }
  console.log(gameMoves.slice(-1)[0]);
}

function undoMove() {
  const move = gameMoves.pop();
  timeMachine.push(move);
  const cell = document.querySelector(`[data-id="${move.index}"]`);
  cell.classList.remove(move.player);
  wonTitle.classList.add('hidden');
  wonMessage.innerText = '';
  checkUndoRedo();
}

function redoMove() {
  const move = timeMachine.pop();
  gameMoves.push(move);
  const cell = document.querySelector(`[data-id="${move.index}"]`);
  cell.classList.add(move.player);
  if (gameMoves.length > 4) {
    checkWin(cell, move.player);
  }
  checkUndoRedo();
}

function checkWin(cell, currentPlayer) {
  const currentPlayerMoves = gameMoves
    .filter(move => move.player === currentPlayer)
    .map(currentPlayerMove => +currentPlayerMove.index);

  const winCombo = winCombos.filter(combo =>
    combo.every(cell => currentPlayerMoves.includes(cell))
  );

  if (winCombo.length > 0) {
    wonTitle.classList.remove('hidden');
    wonMessage.innerText = currentPlayer === TIC ? 'Crosses won!' : 'Toes won!';
    const winComboArray = winCombo[0];
    if (
      winComboArray[2] - winComboArray[1] === 1 &&
      winComboArray[1] - winComboArray[0] === 1
    ) {
      winComboArray.forEach(index => {
        const cell = document.querySelector(`[data-id="${index}"]`);
        cell.classList.add('win');
        cell.classList.add('horizontal');
      });
    } else if (
      winComboArray[2] - winComboArray[1] === 3 &&
      winComboArray[1] - winComboArray[0] === 3
    ) {
      winComboArray.forEach(index => {
        const cell = document.querySelector(`[data-id="${index}"]`);
        cell.classList.add('win');
        cell.classList.add('vertical');
      });
    } else if (
      winComboArray[2] - winComboArray[1] === 2 &&
      winComboArray[1] - winComboArray[0] === 2
    ) {
      winComboArray.forEach(index => {
        const cell = document.querySelector(`[data-id="${index}"]`);
        cell.classList.add('win');
        cell.classList.add('diagonal-left');
      });
    } else {
      winComboArray.forEach(index => {
        const cell = document.querySelector(`[data-id="${index}"]`);
        cell.classList.add('win');
        cell.classList.add('diagonal-right');
      });
    }
    field.removeEventListener('click', clickHandler);
    return;
  }

  if (gameMoves.length === 9) {
    wonTitle.classList.remove('hidden');
    wonMessage.innerText = `It's a draw!`;
    field.removeEventListener('click', clickHandler);
  }
}

function restart() {
  gameMoves.forEach(move => {
    const cell = document.querySelector(`[data-id="${move.index}"]`);
    cell.className = 'cell';
  });
  gameMoves = [];
  checkUndoRedo();
  wonTitle.classList.add('hidden');
  field.addEventListener('click', clickHandler);
}

function clickHandler(event) {
  if (event.target.className === 'cell') {
    getMove(event.target);
  } else {
    event.stopPropagation();
  }
}

// Listeners
checkUndoRedo();

field.addEventListener('click', clickHandler);
undoButton.addEventListener('click', undoMove);
redoButton.addEventListener('click', redoMove);
restartButton.addEventListener('click', restart);
