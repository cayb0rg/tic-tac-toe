const Player = () => {
    let wins = 0;
    const getWins = () => wins;
    const getName = () => name;
    const won = () => {
        wins++;
    }
    const setWins = (num) => {
        wins = num;
    }
    return {won, getWins, setWins, getName};
};

const Game = (() => {

    const PlayerOne = Player();
    const PlayerTwo = Player();

    let numOfTies = 0;

    let currentBoard = [['','',''],['','',''],['','','']];

    let difficulty;

    const checkForWin = () => {
        let match = false;
        let winner = "";
        let board = currentBoard;
    
        let rowMatch = false;
        for (let i = 0; i < 3; i++) { // row
            
            if (board[i][0] == board[i][1] && board[i][0] == board[i][2] && board[i][0] !== "") {
                rowMatch = true;
                winner = board[i][0];
            }
            if (rowMatch) break;
        }
    
        let colMatch = false;
        for (let i = 0; i< 3; i++ ){ // col
            if (board[0][i] == board[1][i] && board[2][i] == board[0][i] && board[0][i] !== "") {
                colMatch = true;
                winner = board[0][i];
            }
            if (colMatch) break;
        }
    
        let matchLeftDiag = false;
        if (board[1][1] == board[0][0] && board[0][0] !== "" && board[2][2] == board[0][0]) {
            matchLeftDiag = true;
            winner = board[0][0];
        }
        
        let matchRightDiag = false;
        if (board[1][1] == board[0][2] && board[0][2] !== "" && board[2][0] == board[0][2]) {
            matchRightDiag = true;
            winner = board[1][1];
        }
    
        if (matchRightDiag || matchLeftDiag || colMatch || rowMatch) {
            match = true;
        }
    
        return [match, winner];
    }
    
    // Parameter must be a two-dimensional array
    const renderBoard = () => {
        
        const domBoard = [document.querySelectorAll('.top'), document.querySelectorAll('.middle'), document.querySelectorAll('.bottom')];
    
        for (var i = 0; i < currentBoard.length; i++) {
            for (var j = 0; j < currentBoard[0].length; j++) {
                if (currentBoard[i][j] == 'X') {
                    domBoard[i][j].style.backgroundImage = 'url(./images/X.png)';
                } else  if (currentBoard[i][j] == 'O') {
                    domBoard[i][j].style.backgroundImage = 'url(./images/O.png)';
                } else {
                    domBoard[i][j].style.backgroundImage = 'none';
                }
            }
        }
    }
    
    const minimax = (board, depth, isMaximizer) => {
            
        let results = checkForWin();
        if (results[1] == "O") { // AI won
            return 100 - depth;
        } else if (results[1] == "X") {
            return -100 + depth;
        } else if (isTerminal(board)) {
            return 0;
        } else {
            if (isMaximizer) {
                // for each move in board, choose one with greatest value
                let bestValue = -1000;
    
                for (let i=0; i<board.length; i++) {
                    for (let j=0; j<board[i].length; j++) {
                        if (board[i][j] == "") {
                            board[i][j] = "O";
                            bestValue = Math.max(bestValue, minimax(board, depth+1, false));
                            board[i][j] = "";
                        }
                    }
                }
                
                return bestValue;
            }
            else if (!isMaximizer) {
                let bestValue = 1000;
    
                for (let i=0; i<board.length; i++) {
                    for (let j=0; j<board[i].length; j++) {
                        if (board[i][j] == "") {
                            board[i][j] = "X";
                            bestValue = Math.min(bestValue, minimax(board, depth+1, true));
                            board[i][j] = "";
                        }
                    }
                }
                return bestValue;
            }
        }
    }
    
    const computerSmartTurn = () => {
        let board = currentBoard;
        let bestMove;
        let bestValue = -1000;

        for (let i = 0; i<3; i++) { 
            for (let j = 0; j<3; j++) { 
                if (board[i][j] == "") {
                    board[i][j] = "O";
                    let value = minimax(board, 0, false);
                    board[i][j] = "";
                    if (value > bestValue) {
                        bestMove = [i,j];
                        bestValue = value;
                    }
                }
            }
        }
        if(bestMove != undefined) board[bestMove[0]][bestMove[1]] = "O";
        renderBoard();           
    }

    const isTerminal = (board) => {
        if (board == undefined) board = currentBoard;
        for (let i=0;i<3;i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == "") return false;
            }
        }
        return true;
    }
    
    // Takes position of player move as parameter
    const playerTurn = (position, turn) => {
        currentBoard[position[0]][position[1]] = turn ?  'X': 'O';
        renderBoard(currentBoard);
    }

    const computerTurn = () => {
        if (difficulty) {
            computerRandomTurn();
        } else {
            computerSmartTurn();
        }
    }

    const computerRandomTurn = () => {
        let randomMove;

        do {
            randomMove = [Math.floor(Math.random()*currentBoard.length), Math.floor(Math.random()*currentBoard[0].length)];
        } 
        while (currentBoard[randomMove[0]][randomMove[1]] != '');

        currentBoard[randomMove[0]][randomMove[1]] = 'O';

        renderBoard();
        
    }
    
    const endRound = (winner) => {
        const modalContent = document.querySelector('.modal-content');
        if (winner == "X") {
            PlayerOne.won();
            modalContent.textContent = `Player One has won!`;
        } else if (winner == "O") {
            PlayerTwo.won();
            modalContent.textContent = `Player Two has won!`
        } else if (winner == "tie") {
            numOfTies++;
            modalContent.textContent = "There was a tie!";
        }

        renderScore();
        
    }

    const resetBoard = () => {
        currentBoard = [['','',''],['','',''],['','','']];
        renderBoard();
    }

    const refresh = () => {
        newGame();
        document.querySelector('.choose-mode').style.display = 'inline-block';
        document.querySelector('.game').style.display = 'none';
    }

    const newGame = () => {
        resetBoard();
        PlayerOne.setWins(0);
        PlayerTwo.setWins(0);
        numOfTies = 0;
        renderScore();
    }

    const renderScore = () => {
        document.getElementById('one_wins').textContent = PlayerOne.getWins();

        document.getElementById('two_wins').textContent = PlayerTwo.getWins();

        document.getElementById('ties').textContent = numOfTies;
    }

    const setDifficulty = (bool) => {
        difficulty = bool;
    }

    return {playerTurn, checkForWin, computerTurn, resetBoard, newGame, endRound, setDifficulty, isTerminal, refresh}

})();

// Parameter must be a two-dimensional array


let numOfPlayers = 1;
let turn = true; // true for player 1, false for player 2

document.getElementById('reset').addEventListener('click', () => {
    Game.resetBoard()
});

document.getElementById('new').addEventListener('click', () => {
    Game.newGame()
});

document.getElementById('refresh').addEventListener('click', () => {
    Game.refresh()
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.querySelector('.modal').classList.remove('open-modal');
    Game.resetBoard();
});

// show single player form
document.getElementById('single').addEventListener('click', () => {
    document.querySelector('.choose-mode').style.display = 'none';
    document.querySelector('.choose-difficulty').style.display = 'inline-block';
    numOfPlayers = 1;
})

document.getElementById('easy').addEventListener('click', () => {

    Game.setDifficulty(true);
    document.querySelector('.choose-difficulty').style.display = 'none';
    document.querySelector('.form').style.display = 'inline-block';
    document.querySelector('.multi-form').style.display = 'none';
})

document.getElementById('hard').addEventListener('click', () => {

    Game.setDifficulty(false);

    document.querySelector('.choose-difficulty').style.display = 'none';
    document.querySelector('.form').style.display = 'inline-block';
    document.querySelector('.multi-form').style.display = 'none';
})

// show multiplayer form
document.getElementById('multi').addEventListener('click', () => {
    document.querySelector('.choose-mode').style.display = 'none';
    document.querySelector('.form').style.display = 'inline-block';
    numOfPlayers = 2;
})

document.querySelectorAll('.submit-form').forEach((btn) => {btn.addEventListener('click', () => {
    document.querySelector('.form').style.display = 'none';
    document.querySelector('.player-one').textContent = document.getElementById('p-one').value;
    document.querySelector('.player-two').textContent = document.getElementById('p-two').value;
    document.querySelector('.game').style.display = 'block';
});
});

// Listen for click events in the DOM

const domBoard = [document.querySelectorAll('.top'), document.querySelectorAll('.middle'), document.querySelectorAll('.bottom')];


for (let i = 0; i < domBoard.length; i++) {
    for (let j = 0; j < domBoard[i].length; j++) {
        domBoard[i][j].addEventListener('click', (e) => {
            if (e.target.style.backgroundImage == '' || e.target.style.backgroundImage == 'none' && Game.checkForWin()[0] == false) { // Check if space is empty and game is not over
                if (numOfPlayers > 1) {
                    Game.playerTurn([i,j], turn);
                    turn = !turn;
                } else {
                    Game.playerTurn([i,j], turn);
                    if (Game.checkForWin()[0] == false || !Game.isTerminal()) {
                        Game.computerTurn();
                    }
                }
                
                if (Game.checkForWin()[0] == true) {
                    Game.endRound(Game.checkForWin()[1]);
                    document.querySelector('.modal').classList.add('open-modal')
                } else if (Game.isTerminal()) {
                    Game.endRound('tie');
                    document.querySelector('.modal').classList.add('open-modal');
                }
                
            }
        })
    }
}
