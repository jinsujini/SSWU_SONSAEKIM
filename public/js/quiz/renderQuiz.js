let currentIndex = 0;
let score = 0;
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
        } else {
            btn.classList.add('red');
            wrongAnswers.push({ ...quiz, selected: opt.text });
        }

        setTimeout(() => {
            currentIndex++;
            if (currentIndex < quizList.length) {
            renderQuiz(quizList[currentIndex]);
            } else {
            localStorage.setItem('score', score);
            //localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers));
            window.location.href = '/quiz/result';
            }
        }, 1000);
        };
    });

    //document.querySelector('.quiz-image').src = quiz.image_url;
    document.querySelector('.quiz-text p').textContent = `${currentIndex + 1}. 이 수어의 의미로 옳은 선택지를 고르시오.`;
    }

    window.onload = () => {
    if (quizList && quizList.length > 0) {
        renderQuiz(quizList[0]);
    }
};
