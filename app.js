const express = require('express');
const cookiParser = require('cookie-parser');
const session = require('express-session');
const db = require('./models'); 

const path = require("path");

const app = express();
app.set('port',process.env.PORT || 3000);

app.use('/',express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookiParser('mySecretKey'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'mySecretKey',
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use((req, res, next) => {
  
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const userRouters = require('./routers/userRouter');
app.use('/', userRouters);

const quizRouter = require('./routers/quizRouter');
app.use('/quiz', quizRouter);

// imitate 연결
const imitateRouter = require('./routers/imitateRouter');
app.use('/imitate', imitateRouter);

const gameRouter = require('./routers/gameRouter');
app.use('/game', gameRouter);

//auth 연결
const authRouter = require('./routers/auth');
app.use('/auth', authRouter);

//수어모델 연결
const predictRouter = require('./routers/predictRouter');
app.use('/api', predictRouter);


//home.ejs 연결
app.get('/', (req, res) => {
    res.render('auth/home');
  });


db.sequelize.sync({ alter: true })
.then(() => {
  console.log('DB 연결 및 테이블 생성(수정)됨');

  app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행 중`);
  });
})
.catch(err => {
  console.error('DB 연결 실패:', err);
});