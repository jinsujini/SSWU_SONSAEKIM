const { User, Attendance, LearningStat } = require('../models');
const { Op } = require('sequelize');
const { BookmarkVc, BookmarkWord, SignVc, SignWord } = require('../models');
const { generateRandomNumber, sendEmail } = require('../lib/email.helper');

const getKoreanDateString = (date = new Date()) => {
    const koreaOffset = 9 * 60 * 60 * 1000;
    return new Date(date.getTime() + koreaOffset).toISOString().slice(0, 10);
};

exports.renderMypage = async (req, res) => {
    const userId = req.session.user?.user_id;
    if (!userId) return res.redirect('/nouser');

    try {
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) return res.redirect('/nouser');

        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 27);

        const attendanceList = await Attendance.findAll({
            where: {
                user_id: userId,
                date: { [Op.gte]: startDate }
            },
            order: [['date', 'ASC']]
        });

        const attendanceDates = attendanceList.map(a => a.date);
        const attendanceSet = new Set(attendanceDates.map(d => getKoreanDateString(new Date(d))));

        let continuous = 0;
        const todayStr = getKoreanDateString();
        if (attendanceSet.has(todayStr)) {
            continuous = 1;
            for (let i = 1; i <= 27; i++) {
                const dStr = getKoreanDateString(new Date(Date.now() - i * 86400000));
                if (attendanceSet.has(dStr)) {
                    continuous++;
                } else {
                    break;
                }
            }
        }

        const totalDays = attendanceList.length;
        const calculatedLevel = Math.floor(totalDays / 7) + 1;

        let stat = await LearningStat.findOne({ where: { user_id: userId } });
        if (!stat) {
            stat = await LearningStat.create({
                user_id: userId,
                total_study_count: totalDays,
                level: calculatedLevel,
                continuous_days: continuous
            });
        } else {
            if (
                stat.level !== calculatedLevel ||
                stat.total_study_count !== totalDays ||
                stat.continuous_days !== continuous
            ) {
                stat.set({
                    level: calculatedLevel,
                    total_study_count: totalDays,
                    continuous_days: continuous
                });
                await stat.save();
            }
        }
        const vcBookmarksRaw = await BookmarkVc.findAll({
            where: { user_id: userId },
            include: [{ model: SignVc, attributes: ['vc_id','image', 'description'] }]
        });

        const wordBookmarksRaw = await BookmarkWord.findAll({
            where: { user_id: userId },
            include: [{ model: SignWord, attributes: ['word_id','image', 'description'] }]
        });
        const vcBookmarks = vcBookmarksRaw.map(b => b.SignVc);
        const wordBookmarks = wordBookmarksRaw.map(b => b.SignWord);


        res.render('mypage/mypage', {
            name: user.name,
            is_logined: req.session.is_logined,
            favorite: user.favorite_study,
            email: user.email,
            level: stat.level,
            totalDays,
            daysToNextLevel: 7 - (totalDays % 7),
            continuousDays: continuous,
            attendanceDates,
            vcBookmarks,
            wordBookmarks
        });
    } catch (err) {
        console.error("마이페이지 조회 오류:", err);
        res.status(500).send("서버 오류 발생");
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.session.user?.user_id;
    const { name } = req.body;

    try {
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) return res.status(404).json({ success: false });

        user.name = name;
        await user.save();

        return res.json({ success: true });
    } catch (err) {
        console.error("이름 업데이트 실패:", err);
        return res.status(500).json({ success: false });
    }
};

exports.goMypage = async (req, res) => {
    const userId = req.session.user?.user_id;
    if (!userId) return res.redirect('/nouser');

    try {
        const user = await User.findOne({ where: { user_id: userId } });
        return res.redirect(user ? '/mypage' : '/nouser');
    } catch (err) {
        console.error("gomypage 리다이렉션 오류:", err);
        return res.status(500).send("서버 오류 발생");
    }
};

exports.sendEmailCode = async (req, res) => {
    const { email } = req.body;
    const code = generateRandomNumber(6);

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: '이미 사용 중인 이메일입니다.' });
        }

        await sendEmail(email, code);
        req.session.emailCode = code;
        req.session.verifiedEmail = email;
        req.session.save(() => res.json({ success: true }));
    } catch (err) {
        console.error("이메일 전송 실패:", err);
        return res.status(500).json({ success: false });
    }
};

exports.verifyEmailCode = (req, res) => {
    const { code, email } = req.body;
    if (
        req.session.emailCode &&
        req.session.verifiedEmail === email &&
        req.session.emailCode === code
    ) {
        return res.json({ success: true });
    }
    return res.json({ success: false });
};

exports.updateEmail = async (req, res) => {
    const userId = req.session.user?.user_id;
    const newEmail = req.body.newEmail;

    if (!userId || !newEmail) return res.status(400).send("유저아이디/이메일 누락");

    if (
        req.session.verifiedEmail !== newEmail ||
        !req.session.emailCode
    ) {
        return res.status(403).send("이메일 인증을 완료해주세요.");
    }

    try {
        const user = await User.findOne({ where: { user_id: userId } });
        if (!user) return res.status(404).send("사용자를 찾을 수 없습니다.");

        user.email = newEmail;
        await user.save();

        req.session.user.email = newEmail;
        delete req.session.emailCode;
        delete req.session.verifiedEmail;

        req.session.save(() => res.redirect('/mypage'));
    } catch (err) {
        console.error("이메일 변경 실패:", err);
        return res.status(500).send("서버 오류 발생");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("세션 삭제 실패:", err);
            return res.status(500).send("서버 오류로 로그아웃에 실패했습니다.");
        }
        res.clearCookie('session-cookie');
        res.redirect('/');
    });
};

exports.renderVcDetail = async (req, res) => {
    const vcId = req.params.id;
    const userId = req.session.user?.user_id;
    try {
        const vcDetail = await SignVc.findOne({ where: { vc_id: vcId } });

        let isBookmarked = false;
        if (userId) {
            const bookmark = await BookmarkVc.findOne({ where: { user_id: userId, vc_id: vcId } });
            isBookmarked = !!bookmark;
        }

        res.render('mypage/bookmarkDetail', {
            image: vcDetail.image,
            description: vcDetail.description,
            backUrl: '/mypage',
            sourceId: vcId,
            sourceType: 'sign_vc',
            isBookmarked
        });
    } catch (err) {
        console.error('자음/모음 조회 오류:', err);
        res.status(500).send('서버 오류 발생');
    }
};

exports.renderWordDetail = async (req, res) => {
    const wordId = req.params.id;
    const userId = req.session.user?.user_id;
    try {
        const wordDetail = await SignWord.findOne({ where: { word_id: wordId } });

        let isBookmarked = false;
        if (userId) {
            const bookmark = await BookmarkWord.findOne({ where: { user_id: userId, word_id: wordId } });
            isBookmarked = !!bookmark;
        }

        res.render('mypage/bookmarkDetail', {
            image: wordDetail.image,
            description: wordDetail.description,
            backUrl: '/mypage',
            sourceId: wordId,
            sourceType: 'sign_word',
            isBookmarked
        });
    } catch (err) {
        console.error('단어 조회 오류:', err);
        res.status(500).send('서버 오류 발생');
    }
};
