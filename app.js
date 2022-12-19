(function() {
  const ticTacToe = (function() {
    const _player1 = player('bink', 'x');
    const _player2 = player('shrimp', 'o'); 

    let _currentPlayer = _player1;
    let _turns = 0;

    const _checkWin = function(){
      const board = gameboard.getBoard();
      if(
        //horizontal
         board.slice(0, 3).toString() === 'x,x,x' || board.slice(0, 3).toString() === 'o,o,o'
       ||board.slice(3, 6).toString() === 'x,x,x' || board.slice(3, 6).toString() === 'o,o,o'
       ||board.slice(6, 9).toString() === 'x,x,x' || board.slice(6, 9).toString() === 'o,o,o'
       //vertical
       ||[board[0], board[3], board[6]].toString() === 'x,x,x' || [board[0], board[3], board[6]].toString() === 'o,o,o'
       ||[board[1], board[4], board[7]].toString() === 'x,x,x' || [board[1], board[4], board[7]].toString() ==='o,o,o'
       ||[board[2], board[5], board[8]].toString() === 'x,x,x' || [board[2], board[5], board[8]].toString() ==='o,o,o'
       //diagonal
       ||[board[0], board[4], board[8]].toString() === 'x,x,x' || [board[0], board[4], board[8]].toString() === 'o,o,o'
       ||[board[2], board[4], board[6]].toString() === 'x,x,x' || [board[2], board[4], board[6]].toString() ==='o,o,o'
      ) {
        return true;
      }
      return false;
    }
    const playRound = function(square) {
      const index = square.className.match(/[0-9]/);
      if(gameboard.updateBoard(index, _currentPlayer.marker)) {
        display.updateSquare(square, _currentPlayer.marker);
        _turns++;
        if(_turns >= 5) {
          if(_checkWin()) {
            console.log(`${_currentPlayer.name} won`);
            return;
          }
        }
        if(_turns === 9) {
          console.log('it\'s a draw');
          return;
        }
        _currentPlayer = (_currentPlayer === _player1) ? _player2 : _player1;
      }
    }
    return {playRound};
  })();

  const display = (function() {
    const boardContainer = document.querySelector('.board');
    const _squares = [];
    const _init = function() {
      _makeGrid();
      _bindEvents();
    }
    const _makeGrid = function() {
      for(let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.classList.add(`square-${i}`);
        boardContainer.append(square);
        _squares.push(square);
      }
    };
    const _bindEvents = function() {
      _squares.forEach(square => {
        square.addEventListener('click', ticTacToe.playRound.bind(this, square));
      });
    };
    const updateSquare = function(square, marker) {
      square.textContent = marker;
    };
    _init();
    return {updateSquare};
  })();

  const gameboard = (function() {
    const _board = Array.from({length: 9});
    const getBoard = function() {
      return Array.from(_board);
    };
    const updateBoard = function(square, marker) {
      if(!_board[square]) {
        _board[square] = marker;
        return true;
      }
      return false;
    }; 
    return {getBoard, updateBoard};
  })();

  function player(name, marker) {
    return {name, marker};
  }

})();