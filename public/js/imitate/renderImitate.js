let currentIndex = 0;
let wrongAnswers = [];

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

window.onload = () => {
    if (imitateList && imitateList.length > 0) {
        renderImitate(imitateList, type);
    }
};
