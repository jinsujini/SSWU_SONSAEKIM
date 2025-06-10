const score = localStorage.getItem('score');
const total = localStorage.getItem('quizTotal');
const sourceType = localStorage.getItem('sourceType');
const isWrongQuiz = localStorage.getItem('isWrongQuiz');

if (score !== null) {
    document.getElementById('score-box').textContent = score;
}
if (total !== null) {
    document.querySelector('.result-total').textContent = `/ ${total}`;
}

if (score === total) {
    const wrongBtn = document.querySelectorAll('.result-button')[0];
    wrongBtn.disabled = true;
    wrongBtn.style.display = 'none';
}

const labelP = document.querySelector('#label p');

if (isWrongQuiz === 'true') {
    labelP.textContent = `오답 퀴즈 결과`; 
} else if (sourceType === 'sign_word') {
    labelP.textContent = `단어/표현 퀴즈 결과`;
} else if (sourceType === 'sign_vc') {
    labelP.textContent = `모음/자음 퀴즈 결과`;
} else {
    labelP.textContent = `퀴즈 결과`; 
}