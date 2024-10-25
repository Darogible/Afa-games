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

    let mineField = [];
    const board = document.getElementById('minesweeperBoard');
    const levelSelect = document.querySelector('.minesweeper-level-select');
    const newGameButton = document.getElementById('newGameButton');
    let gameOver = false;


    const levels = {
        easy: { rows: 8, cols: 8 },
        medium: { rows: 9, cols: 9 },
        hard: { rows: 10, cols: 10 }
    };

    function createBoard(level) {
        board.innerHTML = ''; // Clear the current game board
        const { rows, cols } = levels[level];
        
        mineField = Array.from({ length: rows }, function() {
            return Array.from({ length: cols }, function() {
                return { isMine: false, isRevealed: false };
            });
        });        
    
        gameOver = false; // Reset the game over status
    
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', revealCell);
                board.appendChild(cell);
            }
        }
    
        // Set the number of mines depending on the difficulty level
        const mineCount = level === 'easy' ? 3 : level === 'medium' ? 5 : 7;
        placeMines(rows, cols, mineCount);
    }
    
    
    // Create the board
    createBoard(levelSelect.value);

    function placeMines(rows, cols, mineCount) {
        let placedMines = 0;
    
        // Keep placing mines until all are placed
        while (placedMines < mineCount) {
            // Generate random coordinates for the mine
            let randomRow = Math.floor(Math.random() * rows);
            let randomCol = Math.floor(Math.random() * cols); 
    
             // Check if there is already a mine in the selected cell
            if (!mineField[randomRow][randomCol].isMine) {
                mineField[randomRow][randomCol].isMine = true; // Place a mine in the cell

                /*
                const cell = document.querySelector(`.cell[data-row='${randomRow}'][data-col='${randomCol}']`);
                if (cell) {
                    cell.style.backgroundColor = 'red'; // Visible mine for testing
                }
                */

                placedMines++; 
            }
        }
    }
    
    

    function revealCell(e) {
        if (gameOver) return; // If the game is over, do nothing
    
        const cell = e.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
    
        if (mineField[row][col].isMine) {
            revealMine(row, col); // Show only one mine
            alert(languages[currentLanguage]['gameOver'] || 'Game Over!');
            gameOver = true; // Set game over state
        } else {
            if (!mineField[row][col].isRevealed) {
                cell.classList.add('revealed');
                mineField[row][col].isRevealed = true;
                const mineCount = countAdjacentMines(row, col);
                cell.textContent = mineCount > 0 ? mineCount : '';
    
                if (mineCount === 0) {
                    revealAdjacentCells(row, col);
                }
    
                if (checkWin()) {
                    alert(languages[currentLanguage]['youWin'] || 'You win!');
                    revealAllCells();
                    gameOver = true; // Set game over state
                }
            }
        }
    }
    
    
    function revealAllCells() {
        for (let i = 0; i < mineField.length; i++) {
            for (let j = 0; j < mineField[i].length; j++) {
                const cell = document.querySelector(`.cell[data-row='${i}'][data-col='${j}']`);
                if (!mineField[i][j].isRevealed) {
                    mineField[i][j].isRevealed = true;
                    cell.classList.add('revealed');
                    const mineCount = countAdjacentMines(i, j);
                    cell.textContent = mineCount > 0 ? mineCount : '';
                }
            }
        }
    }
    
    function revealAllMines() {
        for (let i = 0; i < mineField.length; i++) {
            for (let j = 0; j < mineField[i].length; j++) {
                if (mineField[i][j].isMine) {
                    const cell = document.querySelector(`.cell[data-row='${i}'][data-col='${j}']`);
                    cell.classList.add('revealed');
                    cell.style.backgroundColor = 'red';
                }
            }
        }
    }
    
    function revealMine(row, col) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.style.backgroundColor = 'red';
        mineField[row][col].isRevealed = true;
    }
    
    
    
    
    /* Reveals all adjacent cells around the given cell if they are safe.
    If there are no mines around, the function recursively reveals the next adjacent cells */
    function revealAdjacentCells(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
    
        for (let [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            
            if (newRow >= 0 && newRow < mineField.length && newCol >= 0 && newCol < mineField[0].length) {
                const adjacentCell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
                
                if (!mineField[newRow][newCol].isRevealed && !mineField[newRow][newCol].isMine) {
                    mineField[newRow][newCol].isRevealed = true;
                    adjacentCell.classList.add('revealed');
                    const mineCount = countAdjacentMines(newRow, newCol);
                    adjacentCell.textContent = mineCount > 0 ? mineCount : '';
                    
                    if (mineCount === 0) {
                        revealAdjacentCells(newRow, newCol); // Recursively reveal adjacent cells
                    }
                }
            }
        }
    }
    
    
    /* Counts the number of mines around the given cell on the game board.
    Checks all eight possible surrounding cells and returns the number of mines */
    function countAdjacentMines(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        let count = 0;

        for (let [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < mineField.length && newCol >= 0 && newCol < mineField[0].length) {
                if (mineField[newRow][newCol].isMine) {
                    count++;
                }
            }
        }

        return count;
    }

    function checkWin() {
        for (let row of mineField) {
            for (let cell of row) {
                if (!cell.isMine && !cell.isRevealed) {
                    return false; // There are still unrevealed cells that are not mines
                }
            }
        }
        return true; // All cells that are not mines have been revealed
    }
    

    newGameButton.addEventListener('click', function() {
        createBoard(levelSelect.value);
    });

    levelSelect.addEventListener('change', function() {
        createBoard(this.value);
    });

});
