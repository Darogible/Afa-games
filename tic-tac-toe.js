document.addEventListener('DOMContentLoaded', function() {
    // Get the current language from localStorage or default to English
    let currentLanguage = localStorage.getItem('language') || 'en';
  
    // Load the selected language, function is defined in lang.js
    loadLanguage(currentLanguage);
    
    // Function to navigate back to the main page
    function goBack() {
        window.location.href = 'index.html';
    }

    // Click event to the back button
    const backButton = document.querySelector('.backButton');
    backButton.addEventListener('click', goBack);

    const cells = document.querySelectorAll('.cellTic');

    const difficultySelect = document.getElementById('ticTacToeLevelSelect');

    // Click event to the "New Game" button
    const newGameButton = document.getElementById('newGameButton');
    newGameButton.addEventListener('click', resetGameBoard);

    let playerScore = 0;
    let computerScore = 0;
    let gameEnded = false; // Variable to track if the game has ended
    // let turnToMove = false;
    let gameNumber = 1; // Counter for the number of games played

    function markCell(e) {
        const cell = e.target;
        if (cell.textContent === '' && !gameEnded) {
            cell.textContent = 'X';
            checkForWinner(lines);
            if (!gameEnded) {
                setTimeout(computerMove, 10);
            }
        }
    }

    // Set the initial difficulty level
    setDifficulty();
    // Add the event for changing the difficulty level
    difficultySelect.addEventListener('change', setDifficulty);

    function setDifficulty() {
        switch (difficultySelect.value) {
            case 'easy':
                computerMove = computerMoveEasy;
                break;
            case 'medium':
                computerMove = computerMoveMedium;
                break;
            case 'hard':
                computerMove = computerMoveSmart;
                break;
        }
        
        // Reset the game counter, game statistics and game board when changing the difficulty
        gameNumber = 1;
        resetGameStats();
        resetGameBoard(); 
    }

    // Add click event for each cell
    cells.forEach(cell => {
        cell.addEventListener('click', markCell);
    });

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    

    function computerMoveEasy() {
        // Get all empty cells
        const emptyCells = Array.from(cells).filter(cell => cell.textContent === '');
        
        // If there are empty cells
        if (emptyCells.length > 0) {
            // Choose a random empty cell
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const randomCell = emptyCells[randomIndex];

            // Place "O" in the random empty cell
            randomCell.textContent = 'O';
        }
        checkForWinner(lines); // Check for a win after the computer's move
    }

    let num = 0;

    function computerMoveMedium() {
        // Alternates between smart and easy moves
        if(num % 2 == 0){
            computerMoveSmart();
        } else {
            computerMoveEasy();
        }
        num++;
        checkForWinner(lines); // Check for a win after the computer's move
    }

    function computerMoveSmart() {
        // Get all empty cells
        const emptyCells = Array.from(cells).filter(cell => cell.textContent === '');

        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        // Check if there are two "O" in a line and finish it
        for (let line of lines) {
            const [a, b, c] = line;
            if (cells[a].textContent === 'O' && cells[b].textContent === 'O' && cells[c].textContent === '') {
                cells[c].textContent = 'O';
                checkForWinner(lines);
                return;
            }
            if (cells[a].textContent === 'O' && cells[b].textContent === '' && cells[c].textContent === 'O') {
                cells[b].textContent = 'O';
                checkForWinner(lines);
                return;
            }
            if (cells[a].textContent === '' && cells[b].textContent === 'O' && cells[c].textContent === 'O') {
                cells[a].textContent = 'O';
                checkForWinner(lines);
                return;
            }
        }

        // Block two "X" in a row
        for (let line of lines) {
            const [a, b, c] = line;
            if (cells[a].textContent === 'X' && cells[b].textContent === 'X' && cells[c].textContent === '') {
                cells[c].textContent = 'O';
                checkForWinner(lines);
                return;
            }
            if (cells[a].textContent === 'X' && cells[b].textContent === '' && cells[c].textContent === 'X') {
                cells[b].textContent = 'O';
                checkForWinner(lines);
                return;
            }
            if (cells[a].textContent === '' && cells[b].textContent === 'X' && cells[c].textContent === 'X') {
                cells[a].textContent = 'O';
                checkForWinner(lines);
                return;
            }
        }

        // Check center cell
        const centerCell = cells[4];
        if (centerCell.textContent === '') {
            centerCell.textContent = 'O';
            checkForWinner(lines);
            return;
        }

        // Place "O" in a line with one "O"
        for (let line of lines) {
            const [a, b, c] = line;
            if (cells[a].textContent === 'O' && cells[b].textContent === '' && cells[c].textContent === '') {
                cells[b].textContent = 'O';
                checkForWinner(lines);
                return;
            }
            if (cells[a].textContent === '' && cells[b].textContent === 'O' && cells[c].textContent === '') {
                cells[a].textContent = 'O';
                checkForWinner(lines);
                return;
            }
            if (cells[a].textContent === '' && cells[b].textContent === '' && cells[c].textContent === 'O') {
                cells[b].textContent = 'O';
                checkForWinner(lines);
                return;
            }
        }

        // Check corner cells
        const corners = [cells[0], cells[2], cells[6], cells[8]];
        for (let corner of corners) {
            if (corner.textContent === '') {
                corner.textContent = 'O';
                checkForWinner(lines);
                return;
            }
        }

        // If no other options, make random move
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const randomCell = emptyCells[randomIndex];
            randomCell.textContent = 'O';
        }
        checkForWinner(lines); // Check for a win after the computer's move
    }

    function checkForWinner(lines) {
        for (let line of lines) {
            const [a, b, c] = line;
            if (cells[a].textContent === 'O' && cells[b].textContent === 'O' && cells[c].textContent === 'O') {
                announceWinner("Computer", line);
                return;
            }
            if (cells[a].textContent === 'X' && cells[b].textContent === 'X' && cells[c].textContent === 'X') {
                announceWinner("Player", line);
                return;
            }
        }
    
        // If all cells are filled and no winner, it's a draw
        if (Array.from(cells).every(cell => cell.textContent !== '')) {
            announceDraw();
        }
    }
    
    function announceWinner(winner, winningLine) {
        if (winner && !gameEnded) {
            gameEnded = true;
            if (winner === 'Player') {
                playerScore++;
            } else if (winner === 'Computer') {
                computerScore++;
            }
            updateScore();
            
            // Get the winning text based on the winner
            const winnerTextKey = winner === 'Player' ? 'playerWin' : 'computerWin';
            // Get the text in the current language
            const winnerText = languages[currentLanguage][winnerTextKey] || "You win!";
            
            const notification = document.getElementById('winnerNotification');
            const message = document.getElementById('winnerMessage');
            
            message.textContent = winnerText;
            notification.style.display = 'block';
    
            // Highlight the winning cells
            winningLine.forEach(index => {
                cells[index].classList.add('winning');
            });
    
            // Disable clicks on all cells
            cells.forEach(cell => {
                cell.style.pointerEvents = 'none';
            });
    
            setTimeout(() => {
                notification.style.display = 'none';
            }, 1400);
        }
    }
    
    function announceDraw() {
        const notification = document.getElementById('winnerNotification');
        const message = document.getElementById('winnerMessage');
        
        message.textContent = "It's a draw!"; // Set the draw message
        notification.style.display = 'block'; // Show the notification
    
        // Disable clicks on all cells
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    
        setTimeout(() => {
            notification.style.display = 'none'; // Hide the notification after 1.4 seconds
        }, 1400);
    }
    

    function updateScore() {
        const scoreBoard = document.getElementById('gameScore');
        scoreBoard.textContent = `Game score: Player ${playerScore} - Computer ${computerScore}`;
    }

    updateScore(); // Set the initial score

    function resetGameBoard() {
        gameEnded = false; // Reset game end status
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('disabled'); // Remove disabled class if used
            cell.classList.remove('winning'); // Remove winning class on reset
            cell.style.pointerEvents = 'auto'; // Enable clicks on cells
            cell.removeEventListener('click', markCell); // Remove old click handler
            cell.addEventListener('click', markCell); // Add new click handler
        });

        if (gameNumber % 2 === 0) {
            // If it's an even game, computer moves first
            setTimeout(computerMove, 50);
        }

        gameNumber++; // Increase game count
    }

    function resetGameStats() {
        playerScore = 0;
        computerScore = 0;
        updateScore();
    }
    

});
