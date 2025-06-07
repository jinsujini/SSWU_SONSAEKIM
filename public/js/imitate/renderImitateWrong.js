document.addEventListener('DOMContentLoaded', () => {
    const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
    const descriptionEl = document.getElementById('wrong-description');
    const imageEl = document.getElementById('wrong-image');
    const userImageEl = document.getElementById('user-image');
    const container = document.querySelector('.learn-content');
    let currentIndex = 0;
    // container.innerHTML = '';
  
    function renderWrong(index) {
        if (wrongAnswers.length === 0) {
          container.innerHTML = '<p>이번 학습에서 틀린 문제가 없습니다.</p>';
          return;
        }

        const item = wrongAnswers[index];
        descriptionEl.textContent = `${index + 1}. ${item.description}`;

        // 북마크 초기 설정
        const bookmarkBtn = document.getElementById("bookmark-btn");
        const bookmarkImg = document.getElementById("btn-img");
        if (bookmarkBtn) {
            bookmarkBtn.dataset.wordId = item.source_id;
            bookmarkBtn.dataset.sourceType = item.source_type;
            bookmarkImg.src = item.is_bookmarked
                ? '/assets/filled_bookmark.svg'
                : '/assets/empty_bookmark.svg';
        }
        
        imageEl.src = item.image;
        userImageEl.src = item.userImage;
        userImageEl.style.transform = 'scaleX(-1)'; 
      }

    renderWrong(currentIndex);

      // 버튼 이벤트
      document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          renderWrong(currentIndex);
        }
      });
    
      document.getElementById('next-btn').addEventListener('click', () => {
        if (currentIndex < wrongAnswers.length - 1) {
          currentIndex++;
          renderWrong(currentIndex);
        }
      });
    });