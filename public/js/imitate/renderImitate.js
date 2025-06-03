let currentIndex = 0;
let wrongAnswers = [];

function renderImitate(imitateList) {
    const imageElement = document.getElementById("imitate-image");
    const descriptionElement = document.getElementById("imitate-description");
    let video, stream;

    async function showNext() {
        if (currentIndex >= imitateList.length) {
            localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));

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
        
        const isCorrect = await checkAnswer(current);

        if (!isCorrect) {
            wrongAnswers.push({
              description: current.description,
              image: current.image,
              source_id: current.id,
              source_type: current.source_type
            });
        }

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
    
    async function checkAnswer(current){
        return 0;
    }
    
    window.onload = () => {
      if (imitateList && imitateList.length > 0) {
        renderImitate(imitateList);
      }
    };