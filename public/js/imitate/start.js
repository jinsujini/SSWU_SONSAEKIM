 // public/js/start.js

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
        // 권한 있으면 바로 다음 페이지로 이동
        const type = startBtn.dataset.type;
        window.location.href = `/imitate/redirect?type=${type}`;
      } else {
        try {
          // 권한 요청
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          stream.getTracks().forEach(track => track.stop()); // 권한만 확인하려고 스트림 바로 정지
          const type = startBtn.dataset.type;
          window.location.href = `/imitate/redirect?type=${type}`;
        } catch (err) {
          alert('카메라 권한이 필요합니다. 권한을 허용해주세요.');
        }
      }
    });
  });
  