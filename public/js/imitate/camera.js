const delay = ms => new Promise(res => setTimeout(res, ms));

async function connectCamera({ videoId = 'camera', captureDone = () => {}} = {}) {
    const video = document.getElementById(videoId);
    if (!video) {
        console.error('video가 존재하지 않음:');
        return false;
    }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 880 }
      },
      audio: false
    });

      video.srcObject = stream;
      await video.play();

      return { video, stream };

    } catch (err) {
      console.error('카메라 연결 실패:', err);
      return false;
    }
  }
  

  async function autoshot(video, stream){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const snapshotURL = canvas.toDataURL('image/png');

    video.pause();
    video.poster = snapshotURL;
    await delay(1500);

    video.poster = ''; 
    await video.play();
  }

async function startCountdown(targetElementId = 'countdown') {
  const countdown = document.getElementById(targetElementId);
  if (!countdown) return;
 
  countdown.style.opacity = '1';
  countdown.style.visibility = 'visible';

  for (let i = 3; i > 0; i--) {
    countdown.textContent = i;
    await delay(1000);
  }

  countdown.style.opacity = '0';
}
