const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./models'); 
const path = require("path");
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",  
    port: process.env.REDIS_PORT || 6379
  },
});

redisClient.connect().catch(console.error);

app.set('trust proxy', 1);

app.use(cookieParser(process.env.SESSION_SECRET || 'mySecretKey'));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    name: 'session-cookie',
    cookie: {
      httpOnly: true,
      secure: false,           
      maxAge: 1000 * 60 * 60,   
    },
  })
);
app.use('/', express.static(path.join(__dirname, 'public')));

//user 로그인 여부 전역 전달
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
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

//learn 연결
const learnRouter = require('./routers/learnRouter');
app.use('/learn', learnRouter);

const gameRouter = require('./routers/gameRouter');
app.use('/game', gameRouter);

//auth 연결
const authRouter = require('./routers/auth');
app.use('/auth', authRouter);

//수어모델 연결
const predictRouter = require('./routers/predictRouter');
app.use('/api', predictRouter);

//home.ejs 연결
const { isLoggedIn } = require('./middlewares/logincheck.js');

//로그인 전 홈
app.get('/', (req, res) => {
    res.render('layouts/home');
  });

//로그인 후 홈
app.get('/home', isLoggedIn, (req, res) => {
  res.render('auth/loginHome', { user: req.session.user });
});


db.sequelize.sync()
.then(() => {
  console.log('DB 연결 및 테이블 생성됨');

  app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`${app.get('port')}번 포트에서 서버 실행 중`);
});
})
.catch(err => {
  console.error('DB 연결 실패:', err);
});