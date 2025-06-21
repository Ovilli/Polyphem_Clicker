const scoreElem = document.getElementById('score');
const resetBtn = document.getElementById('resetScore');
const clickTarget = document.getElementById('clickTarget');
const soundEffect = document.getElementById('soundEffect');

let score = 0;

chrome.storage.local.get(['score'], (data) => {
  score = data.score || 0;
  scoreElem.textContent = score;
});


resetBtn.addEventListener('click', () => {
  score = 0;
  chrome.storage.local.set({ score });
  scoreElem.textContent = score;
});


clickTarget.addEventListener('click', () => {
  soundEffect.currentTime = 0;
  soundEffect.play();
});
