document.addEventListener('DOMContentLoaded', () => {
    const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
    const descriptionEl = document.getElementById('wrong-description');
    const imageEl = document.getElementById('wrong-image');
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
        
        imageEl.src = item.image;
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