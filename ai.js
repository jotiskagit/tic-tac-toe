import { checkWinner, isBoardFull } from './game.js';

export const getRandomMove = (board) => {
  const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
};

export const getBestMove = (board, player) => {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = player;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

const minimax = (board, depth, isMaximizing) => {
  const result = checkWinner(board);
  if (result) return result.winner === 'O' ? 10 - depth : -10 + depth;
  if (isBoardFull(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = '';
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = '';
      }
    }
    return best;
  }
};
