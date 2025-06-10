const quizService = require('../services/quizService');

exports.showQuizSelect = (req, res) => {
  res.render('quiz/quizMenu');
};

exports.showQuiz = async (req, res) => {
  try {
    const userId = req.session.user?.user_id;
    const type = req.params.type;

    const quizList = await quizService.getQuizList(type, userId);

    res.render('quiz/quizPage', {
      quizList,
      quizTitle: type === 'phoneme' ? '모음/자음 퀴즈' : '단어/표현 퀴즈',
      isWrongQuiz: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('퀴즈 로딩 실패');
  }
};

exports.saveQuizResults = async (req, res) => {
  const userId = req.session.user?.user_id;
  const { quizResults } = req.body;

  if (!userId) return res.status(401).json({ message: '로그인이 필요합니다.' });

  try {
    await quizService.saveQuizResults(userId, quizResults);
    res.json({ message: '저장 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '저장 실패' });
  }
};

exports.showResult = (req, res) => {
  res.render('quiz/quizResult');
};

exports.showWrongAnswers = async (req, res) => {
  const type = req.query.type;
  const userId = req.session.user?.user_id;

  if (type === 'collected') {
    if (!userId) return res.redirect('/login');

    try {
      const quizList = await quizService.getWrongAnswers(userId);

      if (quizList.length === 0) {
        return res.render('quiz/noQuiz');
      }

      return res.render('quiz/quizPage', { quizList,
        quizTitle: '오답 재학습',
        isWrongQuiz: true
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('틀린 문제 로딩 실패');
    }
  }

  res.render('quiz/quizWrong'); // 로컬스토리지 기반
};

exports.toggleBookmark = async (req, res) => {
  const userId = req.session.user?.user_id;
  const { sourceType, sourceId } = req.body;

  if (!userId) return res.status(401).json({ message: '로그인이 필요합니다.' });

  try {
    const status = await quizService.toggleBookmark(userId, sourceType, sourceId);
    res.json({ status });
  } catch (err) {
    console.error('북마크 처리 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.showQuizNone = (req, res) => {
  res.render('quiz/noQuiz');
};