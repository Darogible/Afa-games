// Function to navigate to the selected game's page
function goToGame(gameUrl) {
    window.location.href = gameUrl; // Redirects to the specified URL
}

const gameBoxes = document.querySelectorAll('.game-box');

// Click event for each game box
gameBoxes.forEach(box => {
    box.addEventListener('click', function() {
        const game = box.getAttribute('data-game');
        if (game === 'tic-tac-toe') {
            goToGame('tic-tac-toe.html');
        } else if (game === 'minesweeper') {
            goToGame('minesweeper.html');
        } else if (game === 'battleship') {
            goToGame('battleship.html');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the current language from localStorage or default to English
    let currentLanguage = localStorage.getItem('language') || 'en';

    const languageSelect = document.getElementById('languageSelect');
    languageSelect.value = currentLanguage; // Set the selected language in the dropdown

    // Load the selected language, function is defined in lang.js
    loadLanguage(currentLanguage);

    // Handle language change
    languageSelect.addEventListener('change', function () {
        const selectedLanguage = this.value;
        localStorage.setItem('language', selectedLanguage); // Save the selected language to localStorage
        loadLanguage(selectedLanguage); // Load the selected language
    });
});

  
  

