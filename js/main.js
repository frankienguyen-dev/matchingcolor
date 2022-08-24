import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js';
import {
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js';
import {
  getRandomColorPairs,
  showPlayAgainButton,
  setTimerText,
  hidePlayAgainButton,
  createTimer,
} from './utils.js';

// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(seconds) {
  //show timer text
  const fullSecond = `0${seconds}`.slice(-2);
  setTimerText(fullSecond);
}
function handleTimerFinish() {
  //end game
  gameStatus = GAME_STATUS.FINISHED;
  setTimerText('Game Over 😭');
  showPlayAgainButton();
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function handleColorClick(liElement) {
  const shouleBlockList = [GAME_STATUS.FINISHED, GAME_STATUS.BLOCKING].includes(gameStatus);
  const isClicked = liElement.classList.contains('active');
  if (!liElement || shouleBlockList || isClicked) return;

  liElement.classList.add('active');

  //save clicked cell to selections
  selections.push(liElement);

  if (selections.length < 2) return;

  //check match
  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;
  const isMatch = firstColor === secondColor;

  if (isMatch) {
    //win
    const isWin = getInActiveColorList().length === 0;
    if (isWin) {
      //show replay button
      showPlayAgainButton();
      //show win
      setTimerText('You win! 🎉');
      timer.clear();

      gameStatus = GAME_STATUS.FINISHED;
    }
    selections = [];
    return;
  } else {
    //remove active class for 2 li elements
    gameStatus = GAME_STATUS.BLOCKING;

    setTimeout(() => {
      selections[0].classList.remove('active');
      selections[1].classList.remove('active');

      //reset
      selections = [];

      //race-condition check with handleTimerFinish
      if (gameStatus !== GAME_STATUS.FINISHED) {
        gameStatus = GAME_STATUS.PLAYING;
      }
    }, 500);
  }
}

function initColor() {
  //random 8 pairs of color
  const colorList = getRandomColorPairs(PAIRS_COUNT);

  //bind to li > div.overlay
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index];
    const overlayElement = liElement.querySelector('.overlay');
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index];
  });
}

function attachEventForColorList(liElement, index) {
  const ulElement = getColorListElement();
  if (!ulElement) return;

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;
    handleColorClick(event.target);
  });
}

function resetGame() {
  //reset global variables
  selections = [];
  gameStatus = GAME_STATUS.PLAYING;

  //reset DOM element
  //remove active class from li
  //hide replay button
  //clear you win text/ timeout text
  const colorElementList = getColorElementList();

  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active');
  }

  hidePlayAgainButton();
  setTimerText('');

  //re-generate new color
  initColor();

  //start a new game
  startTimer();
}

function attachAgainForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (!playAgainButton) return;

  playAgainButton.addEventListener('click', resetGame);
}

function startTimer() {
  timer.start();
}

//main
(() => {
  //init color
  initColor();

  //attach event for color list
  attachEventForColorList();

  //attach again for play again button
  attachAgainForPlayAgainButton();

  startTimer();
})();
