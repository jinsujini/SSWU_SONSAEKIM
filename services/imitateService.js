const { SignVc, VcWrong, WordWrong } = require('../models');
const { Op } = require('sequelize');
const { runPythonPrediction } = require('../lib/pythonCaller');

async function getImitateList(type) {
  const imitateList = await SignVc.findAll({
    where: type === 'vowel'
      ? { vc_id: { [Op.gt]: 14 } }
      : { vc_id: { [Op.lte]: 14 } },
    order: SignVc.sequelize.random(),
    limit: 10
  });

  return imitateList.map(item => ({
    ...item.toJSON(),
    image: item.image || ''
  }));
}

function runPrediction(imagePath, correctClass) {
  return new Promise((resolve, reject) => {
    runPythonPrediction(imagePath, (err, predictedClass) => {
      if (err || isNaN(predictedClass)) {
        reject(new Error('예측 실패'));
      } else {
        resolve({ predictedClass, isCorrect: predictedClass === correctClass });
      }
    });
  });
}

async function saveImitateResults(userId, imitateResults) {
  if (!userId) throw new Error('로그인이 필요합니다.');

  for (const result of imitateResults) {
    const common = {
      is_follow: result.is_follow ?? true,
      is_relearned: result.is_relearned ?? null,
      selected: null,
      option1: null,
      option2: null,
      option3: null,
      option4: null,
      answer: result.answer,
      created_at: new Date()
    };

    if (result.source_type === 'vowel' || result.source_type === 'consonant') {
      const where = { user_id: userId, word_id: result.source_id };
      const existing = await WordWrong.findOne({ where });

      if (existing) {
        await WordWrong.update(common, { where });
      } else {
        await WordWrong.create({ user_id: userId, word_id: result.source_id, ...common });
      }
    }
  }
}

module.exports = {
  getImitateList,
  runPrediction,
  saveImitateResults
};
