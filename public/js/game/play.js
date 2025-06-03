let lives = 3;
let score = 0;

const lifeBox = document.querySelector('.life-box');
const fallingContainer = document.querySelector('.falling-container');
const inputBox = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const scoreDisplay = document.querySelector('.score');

inputBox.focus();

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/game/top3');
    const top3 = await res.json();

    const rankingList = document.querySelector('.ranking-list');
    if (!rankingList) return;

    rankingList.innerHTML = '';
    top3.forEach((record, i) => {
      const p = document.createElement('p');
      p.textContent = `${i + 1}등 ${record.User.name} ···· ${record.score}점`;
      rankingList.appendChild(p);
    });
  } catch (err) {
    console.error('랭킹 불러오기 실패', err);
  }
});

async function showGameOver(score) {
  document.getElementById('final-score').innerText = score;
  document.getElementById('gameOverModal').style.display = 'flex';

  try {
    const response = await fetch('/game/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',  
      body: JSON.stringify({ score })
    });

    const result = await response.json();
    console.log('게임 기록 저장 완료됨', result);
  } catch (error) {
    console.error('게임 기록 저장둥 에러 발생 ', error);
  }
}

function restartGame() {
  location.reload();
}

function goToStart() {
  window.location.href = '/game/start'; 
}

inputBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitBtn.click();
  }
});

submitBtn.addEventListener('click', () => {
  const userInput = inputBox.value.trim();
  const fallingImgs = document.querySelectorAll('.falling-img');

  let matched = false;

  fallingImgs.forEach(img => {
    if (img.dataset.value === userInput) {
      img.remove();
      score += 10;
      scoreDisplay.innerText = score;
      matched = true;
    }
  });

  inputBox.value = '';
});

function spawnImage() {
  const img = document.createElement('img');
  img.src = '/assets/sign1.svg';
  img.className = 'falling-img';
  img.dataset.value = '안녕하세요';


  const randomX = Math.random() * 50 -25 ;
  img.style.position = 'absolute';
  img.style.left = `${randomX}vw`;
  img.style.top = '0px';

  fallingContainer.appendChild(img);

  const intervalId = setInterval(() => {
    const imgRect = img.getBoundingClientRect();
    const inputRect = document.querySelector('.input-box').getBoundingClientRect();

    if (imgRect.bottom >= inputRect.top + inputRect.height / 2) {
      img.style.animation = 'none';
      img.remove();
      clearInterval(intervalId);
      loseLife();
    }

    if (!document.body.contains(img)) {
      clearInterval(intervalId);
    }
  }, 50);
}


// 생명 감소
function loseLife() {
  lives--;
  if (lifeBox.children.length > 0) {
    lifeBox.removeChild(lifeBox.children[0]);
  }

  if (lives <= 0) {
    showGameOver(score);
  }
}

// 게임 루프 (예: 2초마다 이미지 생성)
spawnImage();
setInterval(spawnImage, 2000);
