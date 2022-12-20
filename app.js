(function() {
  const ticTacToe = (function() {
    let _player1;
    let _player2;

    let _currentPlayer;
    let _turns = 0;
    let _hasWinner = false;

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
    };

    const playRound = function(square) {
      if(_hasWinner || _turns === 9) {
        return;
      }
      if(!_player1 || !_player2) {
        display.updateMessageContainer('please enter player names');
        return;
      }
      const index = square.className.match(/[0-9]/);
      if(gameboard.updateBoard(index, _currentPlayer.marker)) {
        display.updateSquare(square, _currentPlayer.marker);
        _turns++;
        if(_turns >= 5) {
          if(_checkWin()) {
            display.updateMessageContainer(`${_currentPlayer.name.id ? _currentPlayer.name.id : _currentPlayer.name} won`);
            _hasWinner = true;
            return;
          }
        }
        if(_turns === 9) {
          display.updateMessageContainer('it\'s a draw');
          return;
        }
        _currentPlayer = (_currentPlayer === _player1) ? _player2 : _player1;
        if(_currentPlayer.name.id) {
          computer.makeMove();
        }
      }
    };

    const setPlayer = function(name, marker) {
      if(marker === 'x') {
        _player1 = player(name, marker);
        _currentPlayer = _player1;
      } else {
        _player2 = player(name, marker);
      }
    }

    const resetGame = function() {
      _player1 = null;
      _player2 = null;
      _turns = 0;
      _hasWinner = false;
    }

    return {playRound, setPlayer, resetGame};
  })();

  const display = (function() {
    const boardContainer = document.querySelector('.board');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    const startButton = document.querySelector('.start');
    const resetButton = document.querySelector('.reset');
    const computerButton = document.querySelector('.computer');
    const messageContainer = document.querySelector('.message');
    const _squares = [];

    const _init = function() {
      _makeGrid();
      _bindEvents();
    };

    const _makeGrid = function() {
      for(let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.classList.add(`square-${i}`);
        boardContainer.append(square);
        _squares.push(square);
      }
    };

    const _resetDisplay = function() {
      _squares.forEach(square => square.textContent = '');
      gameboard.resetBoard();
      ticTacToe.resetGame();
      resetButton.style.display = 'none';
      startButton.style.display = 'inline';
      computerButton.style.visibility = 'visible';
      player1Input.value = '';
      player2Input.value = '';
      messageContainer.textContent = '';
    }

    const _getPlayers = function() {
      if(player1Input.value && player2Input.value) {
        messageContainer.textContent = '';
        ticTacToe.setPlayer(player1Input.value, 'x');
        ticTacToe.setPlayer(player2Input.value, 'o');
        startButton.style.display = 'none';
        computerButton.style.visibility = 'hidden';
        resetButton.style.display = 'inline';
      } else {
        messageContainer.textContent = 'please enter player names';
      }
    }

    const _setComputerPlayers = function() {
      ticTacToe.setPlayer('human', 'x');
      ticTacToe.setPlayer({id: 'computer'}, 'o');
      player1Input.value = 'human';
      player2Input.value = 'computer';
      startButton.style.display = 'none';
      computerButton.style.visibility = 'hidden';
      resetButton.style.display = 'inline';
      messageContainer.textContent = '';
    }

    const _bindEvents = function() {
      startButton.addEventListener('click', _getPlayers);
      resetButton.addEventListener('click', _resetDisplay);
      computerButton.addEventListener('click', _setComputerPlayers);
      _squares.forEach(square => {
        square.addEventListener('click', ticTacToe.playRound.bind(this, square));
      });
    };

    const updateSquare = function(square, marker) {
      square.textContent = marker;
    };

    const updateMessageContainer = function(message) {
      messageContainer.textContent = message;
    }

    _init();

    return {updateSquare, updateMessageContainer};
  })();

  const gameboard = (function() {
    const _board = Array.from({length: 9});

    const getBoard = function() {
      return Array.from(_board);
    };

    const getAvailableSquares = function() {
      //returns array of indices of available squares
      let availableSquares = [];
      for(let i = 0; i < _board.length; i++){
        if(!_board[i]) {
          availableSquares.push(i);
        }
      }
      return availableSquares;
    }

    const updateBoard = function(square, marker) {
      if(!_board[square]) {
        _board[square] = marker;
        return true;
      }
      return false;
    }; 

    const resetBoard = function() {
      for(let i = 0; i < 9; i++) {
        _board[i] = null;
      }
    }

    return {getBoard, getAvailableSquares, updateBoard, resetBoard};
  })();

  const computer = (function() {
    const _getRandomMove = function() {
      const availableSquares = gameboard.getAvailableSquares();
      const randomIndex = Math.floor(Math.random() * availableSquares.length);
      return availableSquares[randomIndex];
    };

    const makeMove = function() {
      setTimeout(() => {
        ticTacToe.playRound(document.querySelector(`.square-${_getRandomMove()}`));
      }, 500);
    }

    return {makeMove};
  })();

  function player(name, marker) {
    return {name, marker};
  }
})();