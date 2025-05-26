let currentWrongIndex = 0;
let wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '[]');

function renderWrongAnswer(quiz, index) {
    document.querySelector('.quiz-text p').textContent =
        `${index + 1}. 이 수어의 의미로 옳은 선택지를 고르시오.`;

    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarkBtn) {
        bookmarkBtn.dataset.wordId = quiz.source_id;
    }

    const buttons = document.querySelectorAll('.quiz-btn');
    const options = [
        quiz.option1,
        quiz.option2,
        quiz.option3,
        quiz.option4
    ];

    buttons.forEach((btn, idx) => {
        btn.textContent = `${idx + 1}. ${options[idx]}`;
        btn.classList.remove('green', 'red');

        if (idx + 1 === quiz.answer) {
            btn.classList.add('green'); // 정답
        } else if (options[idx] === quiz.selected) {
            btn.classList.add('red');   // 사용자가 선택한 오답
        }
    });

    document.querySelector('.quiz-image').src = quiz.image;
}

document.addEventListener('DOMContentLoaded', () => {
    if (wrongAnswers.length > 0) {
        renderWrongAnswer(wrongAnswers[0], 0);
    }

    document.querySelectorAll('.nav-btn')[0].addEventListener('click', () => {
        if (currentWrongIndex > 0) {
            currentWrongIndex--;
            renderWrongAnswer(wrongAnswers[currentWrongIndex], currentWrongIndex);
        }
    });

    document.querySelectorAll('.nav-btn')[1].addEventListener('click', () => {
        if (currentWrongIndex < wrongAnswers.length - 1) {
            currentWrongIndex++;
            renderWrongAnswer(wrongAnswers[currentWrongIndex], currentWrongIndex);
        }
    });
});