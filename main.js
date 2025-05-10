// File: main.js
import { createEmptyBoard, checkWinner, switchPlayer, isBoardFull } from './game.js';
import { getBestMove, getRandomMove } from './ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const el = {
    board: document.getElementById('board'),
    mode: document.getElementById('mode'),
    turn: document.getElementById('turn'),
    status: document.getElementById('status'),
    xScore: document.getElementById('playerXScore'),
    oScore: document.getElementById('playerOScore'),
    modal: document.getElementById('modal'),
    modalMsg: document.getElementById('modal-message'),
    playAgain: document.getElementById('play-again'),
    soundToggle: document.getElementById('sound-toggle'),
    bgSelect: document.getElementById('bg-music')
  };

  let board = createEmptyBoard();
  let currentPlayer = 'X';
  let gameActive = true;
  let mode = el.mode.value;
  let scores = { X: 0, O: 0 };

  const sounds = {
    background1: new Audio('sounds/bg1.mp3'),
    background2: new Audio('sounds/bg2.mp3'),
    background3: new Audio('sounds/bg3.mp3'),
  };

  let currentMusic = sounds.background1;
  currentMusic.loop = true;

  const renderBoard = () => {
    el.board.innerHTML = '';
    board.forEach((val, i) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = val;
      cell.onclick = () => handleClick(i);
      el.board.appendChild(cell);
    });
  };

  const handleClick = (index) => {
    if (!gameActive || board[index]) return;
    board[index] = currentPlayer;
    renderBoard();
    const result = checkWinner(board);

    if (result) {
      endGame(`${result.winner} Wins!`, result.pattern);
    } else if (isBoardFull(board)) {
      endGame('Draw!');
    } else {
      currentPlayer = switchPlayer(currentPlayer);
      el.turn.textContent = `Turn: Player ${currentPlayer}`;
      if (mode === 'pva' && currentPlayer === 'O') setTimeout(aiMove, 300);
    }
  };

  const aiMove = () => {
    const move = board.filter(c => c !== '').length === 1 ? getRandomMove(board) : getBestMove(board, 'O');
    handleClick(move);
  };

  const endGame = (msg, winPattern = []) => {
    gameActive = false;
    el.status.textContent = msg;
    if (msg.includes('Wins')) {
      scores[currentPlayer]++;
      updateScores();
    }
    winPattern.forEach(i => el.board.children[i].classList.add('winner'));
    showModal(msg);
  };

  const updateScores = () => {
    el.xScore.textContent = `Player X: ${scores.X}`;
    el.oScore.textContent = `Player O: ${scores.O}`;
  };

  const showModal = (msg) => {
    el.modalMsg.textContent = msg;
    el.modal.style.display = 'flex';
  };

  const hideModal = () => el.modal.style.display = 'none';

  const resetGame = () => {
    board = createEmptyBoard();
    currentPlayer = 'X';
    gameActive = true;
    el.status.textContent = '';
    el.turn.textContent = `Turn: Player ${currentPlayer}`;
    renderBoard();
    if (mode === 'pva' && currentPlayer === 'O') setTimeout(aiMove, 300);
  };

  el.playAgain.onclick = () => {
    hideModal();
    resetGame();
  };

  el.mode.onchange = () => {
    mode = el.mode.value;
    scores = { X: 0, O: 0 };
    updateScores();
    resetGame();
  };

  el.soundToggle.addEventListener('change', () => {
    if (el.soundToggle.checked) {
      currentMusic.play();
    } else {
      currentMusic.pause();
    }
  });

  el.bgSelect.addEventListener('change', () => {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = sounds[el.bgSelect.value];
    currentMusic.loop = true;
    if (el.soundToggle.checked) {
      currentMusic.play();
    }
  });

  resetGame();
});
