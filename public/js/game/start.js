window.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/game/top3');
      const top3 = await res.json();
  
      const rankingList = document.querySelector('.ranking-list');
      if (!rankingList) return;
  
      rankingList.innerHTML = '';
      top3.forEach((record, i) => {
        const p = document.createElement('p');
        p.textContent = `${i + 1}등 ${record.User.name} ···· ${record.score}점`;
        rankingList.appendChild(p);
      });
    } catch (err) {
      console.error('랭킹 불러오기 실패', err);
    }
  });

  window.addEventListener('DOMContentLoaded', async () => {
    const myBestScoreEl = document.getElementById('myBestScore');
  
    try {
      const res = await fetch('/game/my-best-score', { credentials: 'include' });
      
      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/auth/login';
        return;
      }
  
      const data = await res.json();
      myBestScoreEl.textContent = `${data.score}점`;
    } catch (err) {
      console.error('최고 점수 조회 실패', err);
      myBestScoreEl.textContent = `-`;
    }
  });

  function openRanking() {
    document.getElementById('rankingModal').style.display = 'flex';
  }

  function closeRanking() {
    document.getElementById('rankingModal').style.display = 'none';
  }
  function openIntro() {
    document.getElementById('introModal').style.display = 'flex';
  }

  function closeIntro() {
    document.getElementById('introModal').style.display = 'none';
  }