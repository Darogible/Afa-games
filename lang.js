
const languages = {
  en: {
      gameTitleTicTacToe: "Tic Tac Toe",
      gameTitleMinesweeper: "Minesweeper",
      gameTitleBattleship: "Battleship",
      backButton: "Back to Home",
      difficultyEasy: "Easy",
      difficultyMedium: "Medium",
      difficultyHard: "Hard",
      newGameButton: "New game",
      gameScore: "Game Score:",
      winnerMessage: "Congratulations!",
      gameMinesweeper: "Minesweeper",
      gameBattleship: "Battleship",
      randomBattleship: "Random",
      questionAboutNewGame: "Are you sure you want to start a new game?",
      confirmButton: "OK",
      cancelButton: "Cancel",
      startGameButton: "Start Game",
      difficultCheater: "Cheater",
      congratulationsPlayer: "Congratulations! You won!",
      congratulationsPC: "PC won! Try again!",
      playerWin: "You win!",
      computerWin: "Computer wins!",
      gameOver: "Game Over!",
      youWin: "You win!",
  },
  ru: {
      gameTitleTicTacToe: "Крестики-нолики",
      gameTitleMinesweeper: "Сапёр",
      gameTitleBattleship: "Морской бой",
      backButton: "Назад на главную",
      difficultyEasy: "Легко",
      difficultyMedium: "Средне",
      difficultyHard: "Тяжело",
      newGameButton: "Новая игра",
      gameScore: "Счёт игры:",
      winnerMessage: "Поздравляем!",
      gameMinesweeper: "Сапёр",
      gameBattleship: "Морской бой",
      randomBattleship: "Перегенерировать",
      questionAboutNewGame: "Вы уверены, что хотите начать новую игру?",
      confirmButton: "ОК",
      cancelButton: "Отмена",
      startGameButton: "Начать игру",
      difficultCheater: "Читер",
      congratulationsPlayer: "Поздравляем! Вы выиграли!",
      congratulationsPC: "ПК выиграл! Попробуйте снова!",
      playerWin: "Вы выиграли!",
      computerWin: "Компьютер выиграл!",
      gameOver: "Игра окончена!",
      youWin: "Вы выиграли!",
  },
  cs: {
      gameTitleTicTacToe: "Piškvorky",
      gameTitleMinesweeper: "Miny",
      gameTitleBattleship: "Lodě",
      backButton: "Zpět",
      difficultyEasy: "Snadná",
      difficultyMedium: "Střední",
      difficultyHard: "Těžká",
      newGameButton: "Nová hra",
      gameScore: "Herní skóre:",
      winnerMessage: "Gratulujeme!",
      gameMinesweeper: "Miny",
      gameBattleship: "Lodě",
      randomBattleship: "Náhodně",
      questionAboutNewGame: "Jste si jisti, že chcete začít novou hru?",
      confirmButton: "OK",
      cancelButton: "Zrušit",
      startGameButton: "Začít hru",
      difficultCheater: "Podvodník",
      congratulationsPlayer: "Gratulujeme! Vyhrál jsi!",
      congratulationsPC: "PC vyhrál! Zkus to znovu!",
      playerWin: "Vyhrál jsi!",
      computerWin: "Počítač vyhrál!",
      gameOver: "Konec hry!",
      youWin: "Vyhrál jsi!",
  }
};

// Function to load the translation
function loadLanguage(lang) {
  const data = languages[lang]; // Get the selected language from the object
  document.querySelectorAll('[lang-lang]').forEach(elem => {
      const key = elem.getAttribute('lang-lang'); // Get the key for the translation
      if (data[key]) {
          elem.textContent = data[key]; // Update text on the page
      }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Get language from localStorage or set English as default
  let currentLanguage = localStorage.getItem('language') || 'en';

  const languageSelect = document.getElementById('languageSelect');
  languageSelect.value = currentLanguage; // Set the language in the select

  // Load language on first page load
  loadLanguage(currentLanguage);

  // Handler for changing the language
  languageSelect.addEventListener('change', function () {
      const selectedLanguage = this.value;
      localStorage.setItem('language', selectedLanguage); // Save the selected language in localStorage
      loadLanguage(selectedLanguage); // Load the selected language
  });
});

