let currentIndex = 0;

function renderImitate(imitateList) {
    const imageElement = document.getElementById("imitate-image");
    const descriptionElement = document.getElementById("imitate-description");
    let video, stream;

    async function showNext() {
        if (currentIndex >= imitateList.length) {
          window.location.href = '/imitate/result'; //끝나면 오답 페이지로 이동
          return;
        }
    
        const current = imitateList[currentIndex];

        imageElement.src = current.image;
        descriptionElement.textContent = current.description;
    
        //이미지 로드 후에 카운트다운 시작하도록
        await new Promise(resolve => {
            imageElement.onload = resolve;
          });

        await startCountdown();              // 카운트다운
        await autoshot(video, stream);       // 캡처
        currentIndex++;
        await showNext();                    // 다음 문제 호출
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
    
    window.onload = () => {
      if (imitateList && imitateList.length > 0) {
        renderImitate(imitateList);
      }
    };