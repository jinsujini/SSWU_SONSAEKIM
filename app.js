const express = require('express');
const cookiParser = require('cookie-parser');
const session = require('express-session');

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


app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const viewRouter = require('./routers/viewRouters');
app.use('/', viewRouter);

const quizRouter = require('./routers/quizRouter');
app.use('/quiz', quizRouter);

const gameRouter = require('./routers/gameRouter');
app.use('/game', gameRouter);

//auth 연결
const authRouter = require('./routers/auth');
app.use('/auth', authRouter);

//home.ejs 연결
app.get('/', (req, res) => {
    res.render('home');
  });