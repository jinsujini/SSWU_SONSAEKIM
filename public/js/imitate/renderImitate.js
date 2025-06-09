let currentIndex = 0;
let wrongAnswers = [];

async function checkCameraPermission() {
  if (!navigator.permissions) {
    return false;
  }

  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state === 'granted';
  } catch (err) {
    console.error('권한 상태 확인 오류:', err);
    return false;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const learnContent = document.getElementById('learn-content');
  const startMessage = document.getElementById('start-message');

  if (!startBtn || !startMessage || !learnContent) return;


  startBtn.addEventListener('click', async () => {
    const hasPermission = await checkCameraPermission();

    const start = async () => {
      startBtn.classList.add('none');
      startMessage.classList.add('none');
      learnContent.classList.remove('none');
      renderImitate(imitateList, type);
    };

    if (hasPermission) {
      await start();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        stream.getTracks().forEach(track => track.stop());
        await start();
      } catch (err) {
        alert('카메라 권한이 필요합니다. 권한을 허용해주세요.');
      }
    }
  });
});


function renderImitate(imitateList, type) {
  let correctCount = 0;
  const imageElement = document.getElementById("imitate-image");
  const descriptionElement = document.getElementById("imitate-description");
  const imitateNumberElement = document.getElementById("imitate-number");
  let video, stream;

  async function showNext() {
    if (currentIndex >= imitateList.length) {
      localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
      localStorage.setItem('correctCount', correctCount);
      window.location.href = `/imitate/${type}/result`;
      return;
    }

    const current = imitateList[currentIndex];
    imitateNumberElement.textContent = `${currentIndex + 1}. `;
    imageElement.src = current.image;
    descriptionElement.textContent = current.description;

    await new Promise(resolve => {
      imageElement.onload = () => {
        resolve();
      };
    });


    await startCountdown();

    const imageBlob = await autoshot(video);

    let isCorrect = false;
    try {
      isCorrect = await checkAnswer(current, imageBlob);
    } catch (err) {
      console.error('checkAnswer 에러 발생:', err);
    }

    const userImageURL = await blobToBase64(imageBlob);

    if (!isCorrect) {
      wrongAnswers.push({
        description: current.description,
        image: current.image,
        userImage: userImageURL,
        source_id: current.vc_id,
        source_type: current.source_type
      });
    } else {
      correctCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    currentIndex++;
    await showNext();
  }


  connectCamera({ videoId: 'camera' }).then(result => {
    if (!result) {
      console.error('카메라 연결 실패');
      return;
    }
    video = result.video;
    stream = result.stream;

    showNext();
  });
}

async function autoshot(video) {
  flashEffect();

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  return await new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, 'image/jpeg');
  });
}


async function checkAnswer(current, imageBlob) {
  const formData = new FormData();
  formData.append('image', imageBlob);

  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result.predicted === current.description;
  } catch (err) {
    console.error('checkAnswer 오류:', err);
    return false;
  }

}

function flashEffect() {
  const flash = document.createElement('div');
  flash.className = 'flash';
  document.body.appendChild(flash);
  setTimeout(() => document.body.removeChild(flash), 200);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

