export const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  
  export const createEmptyBoard = () => Array(9).fill('');
  
  export const checkWinner = (board) => {
    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], pattern: [a, b, c] };
      }
    }
    return null;
  };
  
  export const isBoardFull = (board) => board.every(cell => cell !== '');
  
  export const switchPlayer = (player) => player === 'X' ? 'O' : 'X';