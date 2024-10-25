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

    function createBoard(board) {
        board.innerHTML = ''; 
        const cellSize = window.innerWidth <= 480 ? '3vw' : '30px';
        
        board.style.gridTemplateColumns = `repeat(10, ${cellSize})`;
        board.style.gridTemplateRows = `repeat(10, ${cellSize})`;
        
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cellBattleship');
                cell.dataset.row = i;
                cell.dataset.col = j;
        
                board.appendChild(cell);
            }
        }
    }
    
    // Function to create numbers and letters
    function createLabels(numbersLayer, lettersLayer) {
        // Add numbers for rows
        for (let i = 1; i <= 10; i++) {
            const div = document.createElement('div');
            div.textContent = i;
            numbersLayer.appendChild(div);
        }
    
        // Add letters for columns
        const letters = 'ABCDEFGHIJ';
        for (let i = 0; i < letters.length; i++) {
            const div = document.createElement('div');
            div.textContent = letters[i];
            lettersLayer.appendChild(div);
        }
    }

    // Create the board
    document.querySelectorAll('.battlefield-board').forEach(createBoard);

    // Create number and letter labels for each board
    createLabels(document.getElementById('numbers-layer-player'), document.getElementById('letters-layer-player'));
    createLabels(document.getElementById('numbers-layer-pc'), document.getElementById('letters-layer-pc'));


    // Turn off clicks on computer board after creating; wait a bit to be sure cells are made
    setTimeout(() => { 
        const pcBoardElement = document.getElementById('battleship-board-pc');
        if (pcBoardElement) {
            const pcCells = document.querySelectorAll('#battleship-board-pc .cellBattleship');
            pcCells.forEach(cell => {
                cell.style.pointerEvents = 'none'; // Turn off clicks on cells
            });
            /* 
            console.log('Clicks on computer board are off at first'); 
            */
        }
    }, 100); // Wait so cells are made

    
    function initializeBoard() {
        const board = [];
        for (let i = 0; i < 10; i++) {
            const row = new Array(10).fill(0);
            board.push(row);
        }
        return board;
    }

    // Check if ship can be placed
    function canPlaceShip(board, row, col, length, orientation) {
        for (let i = 0; i < length; i++) {
            if (orientation === 'horizontal') {
                if (col + i >= 10 || board[row][col + i] !== 0) {
                    // console.log(`Cannot place horizontally at position [${row}, ${col + i}]`);
                    return false; // Ship doesn't fit or cells taken
                }
            } else { 
                if (row + i >= 10 || board[row + i][col] !== 0) {
                    // console.log(`Cannot place vertically at position [${row + i}, ${col}]`);
                    return false; 
                }
            }
        }
        
    
        // Check cells around the ship
        for (let i = -1; i <= length; i++) {
            for (let j = -1; j <= 1; j++) {
                let checkRow = orientation === 'horizontal' ? row + j : row + i;
                let checkCol = orientation === 'horizontal' ? col + i : col + j;
                // Check if ship goes off the board
                if (checkRow >= 0 && checkRow < 10 && checkCol >= 0 && checkCol < 10) {
                    if (board[checkRow][checkCol] !== 0) {
                        // console.log(`Area around is occupied at position [${checkRow}, ${checkCol}]`);
                        return false; // Cell next to ship is taken
                    }
                }
            }
        }

        return true; // Ship can be placed
    }

    // Place the ship on the board
    function placeShip(board, row, col, length, orientation) {
        for (let i = 0; i < length; i++) {
            if (orientation === 'horizontal') {
                board[row][col + i] = 1; 
            } else { 
                board[row + i][col] = 1; 
            }
            

            // Mark the cells around the ship
            for (let i = -1; i <= length; i++) {
                for (let j = -1; j <= 1; j++) {
                    let markRow = orientation === 'horizontal' ? row + j : row + i;
                    let markCol = orientation === 'horizontal' ? col + i : col + j;

                    if (markRow >= 0 && markRow < 10 && markCol >= 0 && markCol < 10 && board[markRow][markCol] === 0) {
                        board[markRow][markCol] = 2; // Mark zones around the ship
                    }
                }
            }
        }

        const closeModalButton = document.getElementById('closeModalButton');
        const modal = document.getElementById('winnerModal');

        closeModalButton.addEventListener('click', function() {
            modal.style.display = 'none'; // Close the modal window
        });
    }

    // Initialize two game boards
    let playerBoard = initializeBoard();
    let pcBoard = initializeBoard();

    const ships = [
        { length: 4, count: 1 },
        { length: 3, count: 2 },
        { length: 2, count: 3 },
        { length: 1, count: 4 }
    ];
    
    // Automatically place all ships on the board
    function placeAllShips(board) {
        const ships = [
            { length: 4, count: 1 },
            { length: 3, count: 2 },
            { length: 2, count: 3 },
            { length: 1, count: 4 }
        ];

        let attempts = 0; // Counter for attempts to place all ships
        const maxAttempts = 1000; // Max number of attempts to place all ships to avoid an infinite loop

        // Place a single ship
        function placeSingleShip(ship) {
            let placed = false;
            let singleShipAttempts = 0; // Counter for attempts to place a single ship

            // Try until the ship is placed or 1000 attempts are reached
            while (!placed && singleShipAttempts < maxAttempts) {
                const row = Math.floor(Math.random() * 10); 
                const col = Math.floor(Math.random() * 10); 
                const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical'; 

                if (canPlaceShip(board, row, col, ship.length, orientation)) {
                    placeShip(board, row, col, ship.length, orientation); // Place the ship if canPlaceShip allows it
                    placed = true; // Ship placed

                    /*
                    console.log(`Ship of length ${ship.length} placed at [${row}, ${col}] with orientation ${orientation}`);
                    */
                }
                singleShipAttempts++;
            }

            return placed;
        }

        // Loop to place all ships
        while (attempts < maxAttempts) {
            attempts++;
            let allPlaced = true; // Track success of placing all ships

            // Clear the matrix of old data
            for (let i = 0; i < 10; i++) {
                board[i].fill(0);
            }

            // Place all ships from the list
            for (let ship of ships) {
                for (let i = 0; i < ship.count; i++) {
                    const placed = placeSingleShip(ship);
                    if (!placed) {
                        allPlaced = false; // If even one ship fails to place, try again
                        break;
                    }
                }
                if (!allPlaced) break; // Extra check for the two lines above
            }

            if (allPlaced) {
                console.log(`All ships successfully placed in ${attempts} attempts!`);
                return;  // End if all ships are successfully placed
            } else {
                console.log('Restarting ship placement...');
            }
        }

        console.error('Failed to place all ships after many attempts.');
    }

    placeAllShips(playerBoard);
    placeAllShips(pcBoard);

    // console.log(playerBoard); // Unstructured output of the board matrix to the console
    // console.table(playerBoard); // Structured output of the board matrix to the console
    // console.log(pcBoard);
    // console.table(pcBoard);


    

        // Display ships on the board
    function renderBoard(board, elementId, isPlayer = true) {
        const boardElement = document.getElementById(elementId);

        boardElement.innerHTML = ''; // Clear the board

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cellBattleship');
                cell.dataset.row = row; // Add row attribute
                cell.dataset.col = col; // Add column attribute

                // Change ship styles
                if (board[row][col] === 1) {
                    cell.classList.add(isPlayer ? 'ship' : 'hidden-ship'); // Make PC ships invisible
                } else if (board[row][col] === 2) {
                    cell.classList.add('ship-zone'); // Zone around the ship
                }

                // Add click handler only for PC board
                if (!isPlayer) {
                    cell.addEventListener('click', function () {
                        /*
                        console.log(`Clicked on PC cell: [${row}, ${col}]`); // Debug log
                        */
                        handleShot(board, row, col, cell);
                    });
                }

                // Add the cell to the board
                boardElement.appendChild(cell);
            }
        }

        console.log(`Click handlers added for ${isPlayer ? 'player' : 'PC'}`);
    }


    // Example usage to display player and PC ships
    renderBoard(playerBoard, 'battleship-board-player', true); // Display player ships
    renderBoard(pcBoard, 'battleship-board-pc', false);        // Display PC ships as hidden

    // Implement random ship placement button for player
    const randomButton = document.getElementById('random');
    randomButton.addEventListener('click', function() {
        placeAllShips(playerBoard);  
        renderBoard(playerBoard, 'battleship-board-player', true); 
    });


    let currentTurn = 'player'; // Start with player's turn


    function isShipSunk(board, row, col) {
        const directions = [
            [0, 1],  
            [1, 0],  
            [0, -1], 
            [-1, 0]  
        ];
    
        // Array to store the coordinates of ship parts
        const shipParts = [[row, col]];
    
        // Function to find all parts of the ship
        function exploreDirection(row, col, dRow, dCol) {
            let newRow = row + dRow;
            let newCol = col + dCol;
    
            // Keep moving in one direction until going out of bounds or hitting an empty cell
            while (
                newRow >= 0 && newRow < 10 &&
                newCol >= 0 && newCol < 10 &&
                (board[newRow][newCol] === 1 || board[newRow][newCol] === 3) 
            ) {
                shipParts.push([newRow, newCol]);
                newRow += dRow;
                newCol += dCol;
            }
        }
    
        // Check all directions from the starting cell
        for (let [dRow, dCol] of directions) {
            exploreDirection(row, col, dRow, dCol);
        }
    
         // Check if all parts of the ship are hit
        for (let [partRow, partCol] of shipParts) {
            if (board[partRow][partCol] === 1) {
                return false; // There are unhit parts of the ship
            }
        }
    
        return true; // All parts of the ship are hit
    }
    
    
    

    function shipSunk(board, row, col, elementId) {
        const shipCells = []; // Array to store the coordinates of sunk ship parts
        const visited = new Set(); // Set to track visited cells
    
        // Function to find all parts of the sunk ship
        function findShipParts(row, col) {
            // If the cell has already been visited, exit the function
            if (visited.has(`${row},${col}`)) return;
    
            // Add the current cell to the visited set
            visited.add(`${row},${col}`);
    
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0], 
                [-1, -1], [-1, 1], [1, -1], [1, 1] 
            ];
    
            // Add the current cell to the ship array
            shipCells.push([row, col]);
    
            // Check all directions to find neighboring parts of the sunk ship
            for (let [dx, dy] of directions) {
                let newRow = row + dx;
                let newCol = col + dy;
    
                // Check the board boundaries
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    if (board[newRow][newCol] === 3) { // Check for hit ship parts
                        findShipParts(newRow, newCol); // If a hit part is found, keep searching
                    }
                }
            }
        }
    
        // Find all parts of the sunk ship starting from the current cell
        findShipParts(row, col);
    
        // Function to mark cells around the sunk ship
        function markSurroundingCells() {
            const directions = [
                [0, 1], [1, 0], [0, -1], [-1, 0], 
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ];
    
            for (let [shipRow, shipCol] of shipCells) {
                for (let [dx, dy] of directions) {
                    let newRow = shipRow + dx;
                    let newCol = shipCol + dy;
    
                    // Check the board boundaries and control the cell is not part of the ship
                    if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                        if (board[newRow][newCol] === 0 || board[newRow][newCol] === 2) {
                            board[newRow][newCol] = 4;  // Mark cells around the ship
    
                            // Update the DOM: find the cell and apply the miss style
                            const cell = document.querySelector(`#${elementId} [data-row='${newRow}'][data-col='${newCol}']`);
                            if (cell) {
                                cell.classList.add('miss'); // Add class for miss (for visual display)
                                cell.textContent = '•'; 
                            }
                        }
                    }
                }
            }
        }
    
        // Mark cells around the sunk ship
        markSurroundingCells();
        /*
        console.table(board); // Display the updated board matrix in the console
        */
    }
    
    
    // Function to check if the PC ship is sunk and mark cells around it
    function handleShot(board, row, col, cell) {
        if (currentTurn !== 'player') return;
        // Check the current state of the cell
        if (board[row][col] === 3 || board[row][col] === 4) {
            console.log("This cell has already been attacked."); // Debug message
            return; // Exit the function if already attacked
        }
        
        // If the cell contains part of a ship ("1"), check if the ship is sunk
        if (board[row][col] === 1) {
            board[row][col] = 3; // Update the matrix value to 3 to mark the hit ship
            console.log(`Player hit cell: [${row}, ${col}]`);
            // Check if the ship is sunk before changing the cell state
            if (isShipSunk(board, row, col)) {
                console.log("Ship sunk!"); // Display message about the sunk ship
                shipSunk(board, row, col, 'battleship-board-pc'); // Use shipSunk with PC board ID
            }
            cell.classList.add('hit'); // Add class for hit
            cell.textContent = 'X'; 

            if (checkForWinner()) {
                return; // If the game is over, block further actions
            }
        } else {
            board[row][col] = 4; // Update the board value to 4 for empty cells
            /*
            console.log(`Player missed at cell: [${row}, ${col}]`);
            */
            cell.classList.add('miss'); // Add class for miss
            cell.textContent = '•';
            currentTurn = 'pc';
            setTimeout(() => pcShoot(playerBoard), 100); // Give PC time to take a turn
        }
    }
        

       
    // Global object to store PC state
    let targetMode = {
        active: false,
        hits: [], // Coordinates of hits on the ship
        direction: null // Attack direction: 'horizontal' or 'vertical'
    };

    const levelSelect = document.getElementById('battleship-level-select');

    function pcShoot(playerBoard) {
        let row, col;

        if (currentTurn !== 'pc') return;

        // If targetMode is active, look for nearby cells to attack
        if (targetMode.active && targetMode.hits.length > 0) {
            [row, col] = chooseNextTargetFromHits(targetMode, playerBoard);
        } else { 
            if(levelSelect.value === "easy"){ // Random shot mode if no active hits
                [row, col] = chooseRandomShot(playerBoard); 
            } else if (levelSelect.value === "hard") { // Smart shot mode if no active hits
                [row, col] = smartMove(playerBoard);
            } else {
                [row, col] = cheaterMove(playerBoard);
            }
        }

        // Perform the shot and update the state
        const hit = performShot(playerBoard, row, col);

        if (hit) {
            targetMode.active = true;
            targetMode.hits.push([row, col]); // Save the hit

             // Determine direction after the second hit
            if (targetMode.hits.length === 2) {
                const [firstHit, secondHit] = targetMode.hits;
                if (firstHit[0] === secondHit[0]) {
                    targetMode.direction = 'horizontal'; // Horizontal direction
                } else if (firstHit[1] === secondHit[1]) {
                    targetMode.direction = 'vertical'; // Vertical direction
                }
            }

            if (isShipSunk(playerBoard, row, col)) {
                shipSunk(playerBoard, row, col, 'battleship-board-player'); // Call the function to mark cells around the sunk ship
                targetMode.active = false; // Reset mode after sinking
                targetMode.hits = []; // Clear hits
                targetMode.direction = null; // Reset direction
                /*
                console.log("Player's ship sunk!");
                */
                if (checkForWinner()) {
                    // If the game is over, block further actions
                    return;
                }
            }
            setTimeout(() => pcShoot(playerBoard), 1000); // PC keeps playing
            return;
        } else { // Miss
            currentTurn = 'player'; // Pass the turn to the player
        }
    }

    // Function to choose the next target based on hits
    function chooseNextTargetFromHits(targetMode, board) {
        const horizontalDirections = [
            [0, 1],  
            [0, -1]  
        ];
        
        const verticalDirections = [
            [1, 0],  
            [-1, 0] 
        ];

        // If direction is already set, attack only in that direction
        if (targetMode.direction === 'horizontal') {
            return checkDirectionForAttack(targetMode.hits, horizontalDirections, board);
        } else if (targetMode.direction === 'vertical') {
            return checkDirectionForAttack(targetMode.hits, verticalDirections, board);
        }

        // If direction is not set, look for all neighboring cells
        const directions = [
            [0, 1], 
            [1, 0],  
            [0, -1], 
            [-1, 0]  
        ];

        for (let [hitRow, hitCol] of targetMode.hits) {
            for (let [dRow, dCol] of directions) {
                let newRow = hitRow + dRow;
                let newCol = hitCol + dCol;

                // Check that coordinates are within the board and the cell has not been attacked yet
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    // Check cells with state "2" (zone around the ship)
                    if (board[newRow][newCol] === 2 || board[newRow][newCol] === 1) {
                        return [newRow, newCol];
                    }
                }
            }
        }

        // If no suitable cells are found, return to random choice
        return chooseRandomShot(board);
    }

    // Check only the specified directions
    function checkDirectionForAttack(hits, directions, board) {
        for (let [hitRow, hitCol] of hits) {
            for (let [dRow, dCol] of directions) {
                let newRow = hitRow + dRow;
                let newCol = hitCol + dCol;

                // Check that coordinates are within the board and the cell has not been attacked yet
                if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                    if (board[newRow][newCol] === 2 || board[newRow][newCol] === 1) { // 2 - zone around ship, 1 - ship
                        return [newRow, newCol];
                    }
                }
            }
        }

        // If nothing found, return empty to trigger fallback
        return chooseRandomShot(board);
    }

    // Function for random shot
    function chooseRandomShot(board) {
        let row, col;
        let validShot = false;

        // Loop to find a random cell that hasn't been shot at
        while (!validShot) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);

            // Check that the cell has not been attacked yet
            if (board[row][col] !== 3 && board[row][col] !== 4) { // 3 - hit part, 4 - miss
                validShot = true;
            }
        }

        return [row, col];
    }
    
    const smartShotsMatrix = Array.from({ length: 10 }, () => Array(10).fill(false));
    let smartStrategy = Math.random() < 0.5;


    function smartMove(board) {
        let row, col;
        let foundStrategicMove = false;

        // Check if there are available cells for the current strategy
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                // Condition checks if the cell fits the current strategy
                if ((smartStrategy ? (i + j) % 2 == 0 : (i + j) % 2 != 0) && board[i][j] !== 3 && board[i][j] !== 4) {
                    foundStrategicMove = true;
                    break;
                }
            }
            if (foundStrategicMove) break;
        }

        if (foundStrategicMove) {
            // If there are available cells, continue shooting by strategy
            do {
                [row, col] = chooseRandomShot(board);
            } while (!(smartStrategy ? (row + col) % 2 == 0 : (row + col) % 2 != 0));
        } else {
            // If no strategic cells left, use random shot
            [row, col] = chooseRandomShot(board);
            /*
            console.log("Strategic cells finished, switching to random shots.");
            */
        }
        /*
        console.log(`Chosen cell: [${row}, ${col}]`);
        */
        return [row, col];
    }

    function cheaterMove(board){
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if(board[i][j] == 1){
                    return [i, j];
                }
            }
        }
    }

    // Function to perform the shot
    function performShot(board, row, col) {
        if (board[row][col] === 1) {
            board[row][col] = 3; // Hit on the ship
            /*
            console.log(`PC hit the player's cell: [${row}, ${col}]`);
            */
            const cell = document.querySelector(`#battleship-board-player [data-row='${row}'][data-col='${col}']`);
            if (cell) {
                cell.classList.add('hit'); // Add class for hit
                cell.textContent = 'X'; 
            }
            return true; // Hit
        } else {
            board[row][col] = 4; // Miss
            /*
            console.log(`PC missed at player's cell: [${row}, ${col}]`);
            */
            const cell = document.querySelector(`#battleship-board-player [data-row='${row}'][data-col='${col}']`);
            if (cell) {
                cell.classList.add('miss'); // Add class for miss
                cell.textContent = '•'; 
            }
            return false; // Miss
        }
    }

    function checkForWinner() {
        const playerShipsRemaining = countShips(playerBoard); // Count remaining player ships
        const pcShipsRemaining = countShips(pcBoard);  // Count remaining PC ships

        if (playerShipsRemaining === 0) {
            // Announce PC as winner
            announceWinner('PC');
            return true; // Game over
        } else if (pcShipsRemaining === 0) {
            // Announce player as winner
            announceWinner('Player');
            return true; // Game over
        }
        
        return false; // Game continues
    }

    function countShips(board) {
        let shipCount = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === 1) { // Ship not hit
                    shipCount++;
                }
            }
        }
        return shipCount; // Return the count of remaining ship parts
    }

    function announceWinner(winner) {
        // Set message key based on the winner
        const messageKey = winner === 'Player' ? 'congratulationsPlayer' : 'congratulationsPC';
    
        // Get the message text in the current language
        const message = languages[currentLanguage][messageKey] || 'Congratulations! You won!';
        
        // Close the modal window when clicking the "OK" button
        const modal = document.getElementById('winnerModal');
        const winnerMessage = document.getElementById('winnerMessage');
        winnerMessage.textContent = message;
    
        modal.style.display = 'flex'; // Show the modal window
    
        // Close the modal window when clicking the "OK" button
        const closeModalButton = document.getElementById('closeModalButton');  // Use the correct ID
        closeModalButton.addEventListener('click', function() {
            modal.style.display = 'none'; // Hide the modal window
        });
    }

    const startGameButton = document.getElementById('start-game-button');
    let gameStarted = false;

    // Function to clear the visual state of the game board
    function resetVisualBoard() {
        // Get all game board cells with class 'cellBattleship'
        const cells = document.querySelectorAll('.cellBattleship');
        cells.forEach(cell => {
            cell.classList.remove('ship', 'hit', 'miss', 'hidden-ship', 'ship-zone'); // Remove all classes
            cell.textContent = ''; 
            cell.style.backgroundColor = ''; 
        });
    }

    // Function to reset game data
    function resetGameData() {
        // Reset data arrays
        playerBoard = initializeBoard(); // Recreate an empty player board
        pcBoard = initializeBoard();     // Recreate an empty PC board

        // Place the ships again
        placeAllShips(playerBoard); // Place player ships
        placeAllShips(pcBoard);     // Place computer ships

        // Display the boards with new ships
        renderBoard(playerBoard, 'battleship-board-player', true);
        renderBoard(pcBoard, 'battleship-board-pc', false);

        // Reset game variables
        gameStarted = false;
    }

    const modal = document.getElementById('modal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    // Function to open the modal window
    function showModal() {
        modal.style.display = 'flex'; // Show the modal window
    }

    // Function to close the modal window
    function closeModal() {
        modal.style.display = 'none'; // Hide the modal window
    }

    // Event handler for the "OK" button
    confirmButton.addEventListener('click', function() {
        closeModal();
        resetVisualBoard();
        resetGameData();
        startGameButton.textContent = 'Start Game';
        levelSelect.disabled = false;
        randomButton.style.visibility = 'visible';
        gameStarted = false;
        smartStrategy = Math.random() < 0.5;
        updateStartButtonText();

        const pcBoardElement = document.getElementById('battleship-board-pc');
        if (pcBoardElement) {
            pcBoardElement.classList.add('blur-effect');  // Add the "blur-effect" class back
            pcBoardElement.style.filter = 'blur(7px)';  // Force the blur filter
            console.log('Blur effect manually added via JS');
        }

        console.log("Game reset to initial state");
    });


    // Event handler for the "Cancel" button
    cancelButton.addEventListener('click', function() {
        closeModal(); // Close the modal window
        console.log("User canceled starting a new game");
    });


    // Function to update the start button text based on the current language
    function updateStartButtonText() {
        const textKey = gameStarted ? 'newGameButton' : 'startGameButton';
        startGameButton.textContent = languages[currentLanguage][textKey] || 'Start Game';
    }

    // Update the button text when the page loads
    updateStartButtonText();

    // Event handler for the start game button
    startGameButton.addEventListener('click', function() {
        const pcBoardElement = document.getElementById('battleship-board-pc');

        if (!gameStarted) {
            startGameButton.textContent = 'New Game';
            levelSelect.disabled = true;
            randomButton.style.visibility = 'hidden';
            gameStarted = true;
            updateStartButtonText(); // Update text to "New Game"

            if (pcBoardElement) {
                pcBoardElement.classList.remove('blur-effect'); // Remove the "blur-effect" class
                pcBoardElement.style.filter = 'none'; // Remove the filter from the board
                pcBoardElement.style.pointerEvents = 'auto'; // Enable clicks on the board

                // Enable clicks for each cell on the PC board
                const pcCells = document.querySelectorAll('#battleship-board-pc .cellBattleship');
                pcCells.forEach(cell => {
                    cell.style.pointerEvents = 'auto'; // Enable clicks on cells
                });

                console.log('Blur effect removed, clicks enabled');
            }

            console.log("Game started");
        } else {
            showModal();
        }
    });



});
