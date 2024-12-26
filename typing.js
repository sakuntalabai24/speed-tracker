const playBtn = document.getElementById('play-btn');
const wordArea = document.getElementById('word-area');
const inputBox = document.getElementById('input-box');
const scoreDisplay = document.getElementById('score-display');
const shooter = document.getElementById('shooter');

let level =localStorage.getItem('gameLevel');
let gameActive = false; 
let words = [];
let accuracy=0;
let score = 0;
let speed = 0;
let timeLeft = level==='medium'? 30:(level==='hard'?60:20); 
let timerInterval;

function getRandomWord() {
  let wordList;
  if (level === 'easy') {
  wordList = ['code', 'bug', 'data', 'loop', 'file', 'run', 'test', 'array', 'logic', 'save'];
  } else if (level === 'medium') {
  wordList = ['algorithm', 'debugging', 'function', 'variable', 'recursive', 'parameter', 'compile', 'binary', 'prototype', 'condition'];
  } else if (level === 'hard') {
  wordList = ['asynchronous', 'encapsulation', 'polymorphism', 'multithreading', 'inheritance', 'reflection', 'serialization', 'optimization', 'constructor', 'framework'];
  }
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
    } else {
      clearInterval(timerInterval);
      endGame(); 
    }
  }, 1000);
}

function endGame() {
  gameActive = false; 
  inputBox.disabled = true; 
  
  const gameOverButton = document.createElement("button");
  gameOverButton.id = "game-over";
  gameOverButton.innerText = "Game Over";
  gameOverButton.style.display = "block";
  gameOverButton.style.margin = "20px auto";
  gameOverButton.style.padding = "10px 20px";
  gameOverButton.style.background = "#ff0000";
  gameOverButton.style.color = "#fff";
  gameOverButton.style.border = "none";
  gameOverButton.style.borderRadius = "5px";
  gameOverButton.style.fontSize = "20px";
  wordArea.appendChild(gameOverButton);
  console.log(score);
  localStorage.setItem('score',score)
  localStorage.setItem('speed',Math.floor(score/6))
  localStorage.setItem('accuracy',100-score+"%");
  document.getElementById("game-over").addEventListener("click", function () {
    window.location.assign("typing3.html"); 
  });
  
}

function resetGame() {
  clearInterval(timerInterval); 
  gameActive = true; 
  timeLeft = level === 'medium' ? 30 : (level === 'hard' ? 60 : 20); 
  score = 0; 
  inputBox.disabled = false; 
  inputBox.value = ''; 
  document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
  scoreDisplay.textContent = `Score: ${score}`;
  console.log('score - ', score)
  words.forEach((word) => wordArea.removeChild(word)); 
  words = []; 
  startTimer(); 
  gameLoop(); 
}

function spawnWord() {
  const word = document.createElement('div');
  word.className = 'word';
  word.innerText = getRandomWord();
  word.style.position = 'absolute';
  word.style.left = `${Math.random() * (wordArea.offsetWidth - 50)}px`;
  word.style.top = '0px';
  wordArea.appendChild(word);
  words.push(word);
}

function createSparkEffect(x, y) {
const spark = document.createElement('div');
spark.classList.add('spark');
spark.style.left = `${x}px`;
spark.style.top = `${y}px`;
wordArea.appendChild(spark);
setTimeout(() => {
spark.remove(); 
}, 500);
}

inputBox.addEventListener('input', () => {
const currentTypedWord = inputBox.value.trim();
words.forEach((word, index) => {
if (word.innerText === currentTypedWord) {
  
  score+=10;
  scoreDisplay.innerText = `Score: ${score}`;

  createSparkEffect(parseInt(word.style.left), parseInt(word.style.top));
  
  wordArea.removeChild(word);
  words.splice(index, 1);

  inputBox.value = '';
}
});
});

function moveWords() {
  words.forEach((word, index) => {
    const currentTop = parseInt(word.style.top);
    if (currentTop < wordArea.offsetHeight - 50) {
      word.style.top = `${currentTop + 2}px`;
    } else {
      wordArea.removeChild(word);
      words.splice(index, 1);
    }
  });
}

function gameLoop() {
  if (!gameActive) return; 
  moveWords();
  if (Math.random() < 0.01) spawnWord();
  requestAnimationFrame(gameLoop);
}

playBtn.addEventListener('click', () => {
  document.getElementById('start-menu').style.display = 'none'; 
  gameActive = true; 
  startTimer(); 
  gameLoop(); 
});

inputBox.addEventListener('input', () => {
  const currentTypedWord = inputBox.value.trim();
  words.forEach((word, index) => {
    if (word.innerText === currentTypedWord) {
      score++;
      scoreDisplay.innerText = `Score: ${score}`;
      wordArea.removeChild(word);
      words.splice(index, 1);
      inputBox.value = '';
    }
  });
});

document.getElementById('play-again').addEventListener('click', resetGame);
document.addEventListener('DOMContentLoaded', (event) => {
  const toggleButton = document.getElementById('toggle-theme');
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
  });
});