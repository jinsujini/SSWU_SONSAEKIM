// public/js/camera.js

const delay = ms => new Promise(res => setTimeout(res, ms));

async function connectCamera({ videoId = 'camera' } = {}) {
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
      
      await autoshot(video, stream);
      return true;

    } catch (err) {
      console.error('카메라 연결 실패:', err);
      return false;
    }
  }
  
  async function autoshot(video, stream){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    await delay(3000);
    
    // 화면 캡처
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const snapshotURL = canvas.toDataURL('image/png');

    video.pause();
    video.poster = snapshotURL;
    await delay(1500);

    video.poster = ''; 
    video.srcObject = stream;
    await video.play();
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    const success = await connectCamera({ videoId: 'camera' });
    if (!success) {
      console.error('카메라 연결 실패');
    }
  });
