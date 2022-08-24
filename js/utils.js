import { getPlayAgainButton, getTimerElement } from './selectors.js';

function shuffer(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return;

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);

    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  //random 'count' color
  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    });

    colorList.push(color);
  }

  //double current color list
  const fullColorList = [...colorList, ...colorList];

  //shuffle
  shuffer(fullColorList);

  return fullColorList;
};

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (playAgainButton) {
    playAgainButton.classList.add('show');
  }
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton();
  if (playAgainButton) {
    playAgainButton.classList.remove('show');
  }
}

export function setTimerText(text) {
  const timerElement = getTimerElement();
  if (timerElement) timerElement.textContent = text;
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalID = null;

  function start() {
    clear();
    let currentSeconds = seconds;
    intervalID = setInterval(() => {
      if(onChange) {
        onChange(currentSeconds);
      }

      currentSeconds--;

      if (currentSeconds < 0) {
        clear();
        if(onFinish) {
          onFinish();
        }
      }
    }, 1000);
  }

  function clear() {
    clearInterval(intervalID);
  }
  return {
    start,
    clear,
  };
}
