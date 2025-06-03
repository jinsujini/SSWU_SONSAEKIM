let currentWrongIndex = 0;
let wrongAnswers = window.wrongAnswers || JSON.parse(localStorage.getItem('wrongAnswers') || '[]');

function renderWrongAnswer(quiz) {
    const number = quiz.number || '-'; 

    document.querySelector('.quiz-text p').textContent =
        `${number}. 이 수어의 의미로 옳은 선택지를 고르시오.`;

    // 북마크 초기 설정
    const bookmarkBtn = document.getElementById("bookmark-btn");
    const bookmarkImg = document.getElementById("btn-img");
    if (bookmarkBtn) {
        bookmarkBtn.dataset.wordId = quiz.source_id;
        bookmarkBtn.dataset.sourceType = quiz.source_type;
        bookmarkImg.src = quiz.is_bookmarked
            ? '/assets/filled_bookmark.svg'
            : '/assets/empty_bookmark.svg';
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
        } else if (idx + 1 === quiz.selected) {
            btn.classList.add('red');   // 사용자가 선택한 오답
        }
    });

    document.getElementById('quiz-image').src = quiz.image;
}

document.addEventListener('DOMContentLoaded', () => {
    if (wrongAnswers.length > 0) {
        renderWrongAnswer(wrongAnswers[0], 0);
    }

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentWrongIndex > 0) {
            currentWrongIndex--;
            renderWrongAnswer(wrongAnswers[currentWrongIndex], currentWrongIndex);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentWrongIndex < wrongAnswers.length - 1) {
            currentWrongIndex++;
            renderWrongAnswer(wrongAnswers[currentWrongIndex], currentWrongIndex);
        }
    });
});