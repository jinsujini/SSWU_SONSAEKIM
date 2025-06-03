let currentIndex = 0;
let wrongAnswers = [];

function renderImitate(imitateList) {
    const imageElement = document.getElementById("imitate-image");
    const descriptionElement = document.getElementById("imitate-description");
    let video, stream;

    async function showNext() {
        if (currentIndex >= imitateList.length) {
            localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
            window.location.href = '/imitate/result';
            return;
        }

        const current = imitateList[currentIndex];
        imageElement.src = current.image;
        descriptionElement.textContent = current.description;

        await new Promise(resolve => {
            imageElement.onload = resolve;
        });

        await startCountdown();
        const imageBlob = await autoshot(video);
        const isCorrect = await checkAnswer(current, imageBlob);

        if (!isCorrect) {
            wrongAnswers.push({
                description: current.description,
                image: current.image,
                source_id: current.id,
                source_type: current.source_type
            });
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

        return result.predicted === current.description;
    } catch (err) {
        console.error('checkAnswer 오류:', err);
        return false;
    }
}

window.onload = () => {
    if (imitateList && imitateList.length > 0) {
        renderImitate(imitateList);
    }
};
