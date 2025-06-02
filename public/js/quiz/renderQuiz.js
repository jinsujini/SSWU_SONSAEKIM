let currentIndex = 0;
let score = 0;
let correctAnswers = [];
let wrongAnswers = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderQuiz(quiz) {
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarkBtn) {
        bookmarkBtn.dataset.wordId = quiz.source_id;
    }

    const buttons = document.querySelectorAll('.quiz-btn');
    document.getElementById("quiz-image").src = quiz.image;

    const options = [
        { text: quiz.option1, isAnswer: quiz.answer === 1 },
        { text: quiz.option2, isAnswer: quiz.answer === 2 },
        { text: quiz.option3, isAnswer: quiz.answer === 3 },
        { text: quiz.option4, isAnswer: quiz.answer === 4 }
    ];

    const shuffled = shuffleArray(options);

    shuffled.forEach((opt, idx) => {
        const btn = buttons[idx];
        btn.textContent = `${idx + 1}. ${opt.text}`;
        btn.disabled = false;
        btn.classList.remove('green', 'red');

        btn.onclick = () => {
            buttons.forEach(b => b.disabled = true);

            if (opt.isAnswer) {
                btn.classList.add('green');
                score++;
                correctAnswers.push({
                    ...quiz,
                    is_relearned: true,
                    is_follow: false
                });
            } else {
                btn.classList.add('red');
                wrongAnswers.push({
                    ...quiz,
                    selected: opt.text,
                    is_relearned: false,
                    is_follow: false
                });
            }

            setTimeout(() => {
                currentIndex++;
                if (currentIndex < quizList.length) {
                    renderQuiz(quizList[currentIndex]);
                } else {
                    const quizResults = [...correctAnswers, ...wrongAnswers];

                    // 점수 및 오답 저장
                    localStorage.setItem('score', score);
                    localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));

                    // 서버로 전체 푼 문제 결과 전송
                    fetch('/quiz/result/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quizResults })
                    }).then(() => {
                        window.location.href = '/quiz/result';
                    }).catch(err => {
                        console.error('결과 저장 실패:', err);
                        window.location.href = '/quiz/result';
                    });
                }
            }, 1000);
        };
    });

    document.querySelector('.quiz-text p').textContent =
        `${currentIndex + 1}. 이 수어의 의미로 옳은 선택지를 고르시오.`;
}

window.onload = () => {
    if (quizList && quizList.length > 0) {
        localStorage.setItem('quizTotal', quizList.length);
        renderQuiz(quizList[0]);
    }
};