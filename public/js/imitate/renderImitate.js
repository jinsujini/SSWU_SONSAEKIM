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
    if (!startBtn) return;
  
    startBtn.addEventListener('click', async () => {
      const hasPermission = await checkCameraPermission();
  
      if (hasPermission) {
         renderImitate(imitateList, type);
      } else {
        try {
          // 권한 요청
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          stream.getTracks().forEach(track => track.stop()); // 권한만 확인하려고 스트림 바로 정지
          const type = startBtn.dataset.type;
          renderImitate(imitateList, type);
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
            imageElement.onload = resolve;
          });

        await startCountdown();
        const imageBlob = await autoshot(video);
        const isCorrect = await checkAnswer(current, imageBlob);
        const userImageURL = await blobToBase64(imageBlob);

        if (!isCorrect) {
            wrongAnswers.push({
              description: current.description,
              image: current.image,
              userImage: userImageURL,
              source_id: current.id,
              source_type: current.source_type
            });
        }
        else if(isCorrect){
            correctCount++;
        }

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
        const response = await fetch('http://127.0.0.1:5001/predict', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log("Flask API :", result);
        console.log("예측값:", result.predicted, "정답:", current.description);
        console.log("일치 여부:", result.predicted === current.description);
        
        return result.predicted === current.description;
    } catch (err) {
        console.error('checkAnswer 오류:', err);
        return false;
    }
}
   
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
}

