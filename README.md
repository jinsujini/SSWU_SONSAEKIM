# ✋ 손새김
<p align="center">
  <img src="https://github.com/user-attachments/assets/3fdc0aa4-e5ab-4e76-9f90-8c6bfb576c7b" width="45%" style="display:inline-block; margin-right: 10px;"/>
  <img src="https://github.com/user-attachments/assets/10c62af1-fc90-42f8-8a0c-63e04528f254" width="45%" style="display:inline-block;"/>
</p>

<br/>

## 🔮 화면 구성

<br/>

## 🍀 팀원 소개
### sswu Computer Engineering
#### Team 수황

<br/>

|<img src="https://github.com/yyen0.png" width="150"/>|<img src="https://github.com/88guri.png" width="150"/>|<img src="https://github.com/mminnn28.png" width="150"/>|<img src="https://github.com/s0obang.png" width="150"/>|<img src="https://github.com/jinsujini.png" width="150"/>|
|:-:|:-:|:-:|:-:|:-:|
|김예은<br/>[@yyen0](https://github.com/yyen0)|박시현<br/>[@88guri](https://github.com/88guri)|전민선<br/>[@mminnn28](https://github.com/mminnn28)|조수빈<br/>[@s0obang](https://github.com/s0obang)|최수진<br/>[@jinsujini](https://github.com/jinsujini)|

<br/>

## 📂 폴더 구조
```
📂 SSWU_SONSAEKIM
├─ app.js
├─ configs
│  ├─ config.js
│  └─ redis.js
├─ controllers
│  ├─ authController.js
│  ├─ gameController.js
│  ├─ imitateController.js
│  ├─ learnController.js
│  ├─ mypageController.js
│  ├─ predictController.js
│  └─ quizController.js
├─ flask_server
│  ├─ app.py
│  ├─ models
│  │  └─ multi_hand_gesture_classifier.tflite
│  ├─ modules
│  │  ├─ holistic_module.py
│  │  ├─ utils.py
│  │  └─ __pycache__
│  │     ├─ holistic_module.cpython-312.pyc
│  │     └─ utils.cpython-312.pyc
│  ├─ predict_image.py
│  ├─ requirements.txt
│  └─ __pycache__
│     └─ predict_image.cpython-312.pyc
├─ lib
│  ├─ auth.js
│  ├─ email.helper.js
│  └─ pythonCaller.js
├─ middlewares
│  └─ logincheck.js
├─ models
│  ├─ GameRecord.js
│  ├─ index.js
│  ├─ mypage
│  │  ├─ Attendance.js
│  │  └─ LearningStat.js
│  ├─ quiz
│  │  ├─ bookmarkVc.js
│  │  ├─ bookmarkWord.js
│  │  ├─ quiz.js
│  │  ├─ signVc.js
│  │  ├─ signWord.js
│  │  ├─ vcWrong.js
│  │  └─ wordWrong.js
│  └─ User.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ assets
│  │  ├─ back.svg
│  │  ├─ empty_bookmark.svg
│  │  ├─ filled_bookmark.svg
│  │  ├─ gamearrow.svg
│  │  ├─ hand.svg
│  │  ├─ hand_icon
│  │  │  ├─ glass.svg
│  │  │  ├─ left.png
│  │  │  ├─ left_1.png
│  │  │  ├─ left_2.png
│  │  │  ├─ level1.png
│  │  │  ├─ level1.svg
│  │  │  ├─ level2.svg
│  │  │  ├─ level3.svg
│  │  │  ├─ right.png
│  │  │  ├─ right_1.png
│  │  │  ├─ right_2.png
│  │  │  └─ ring.svg
│  │  ├─ intro.png
│  │  ├─ left-btn.svg
│  │  ├─ logo.svg
│  │  ├─ logo_hand.svg
│  │  ├─ right-btn.svg
│  │  ├─ sign1.svg
│  │  ├─ sign_vc
│  │  │  ├─ 수어_ㄱ.png
│  │  │  ├─ 수어_ㄴ.png
│  │  │  ├─ 수어_ㄷ.png
│  │  │  ├─ 수어_ㄹ.png
│  │  │  ├─ 수어_ㅁ.png
│  │  │  ├─ 수어_ㅂ.png
│  │  │  ├─ 수어_ㅅ.png
│  │  │  ├─ 수어_ㅇ.png
│  │  │  ├─ 수어_ㅈ.png
│  │  │  ├─ 수어_ㅊ.png
│  │  │  ├─ 수어_ㅋ.png
│  │  │  ├─ 수어_ㅌ.png
│  │  │  ├─ 수어_ㅍ.png
│  │  │  ├─ 수어_ㅎ.png
│  │  │  ├─ 수어_ㅏ.png
│  │  │  ├─ 수어_ㅐ.png
│  │  │  ├─ 수어_ㅑ.png
│  │  │  ├─ 수어_ㅒ.png
│  │  │  ├─ 수어_ㅓ.png
│  │  │  ├─ 수어_ㅔ.png
│  │  │  ├─ 수어_ㅕ.png
│  │  │  ├─ 수어_ㅖ.png
│  │  │  ├─ 수어_ㅗ.png
│  │  │  ├─ 수어_ㅚ.png
│  │  │  ├─ 수어_ㅛ.png
│  │  │  ├─ 수어_ㅜ.png
│  │  │  ├─ 수어_ㅟ.png
│  │  │  ├─ 수어_ㅠ.png
│  │  │  ├─ 수어_ㅡ.png
│  │  │  ├─ 수어_ㅢ.png
│  │  │  └─ 수어_ㅣ.png
│  │  └─ sign_word
│  │     ├─ 개.jpg
│  │     ├─ 걷어차다.png
│  │     ├─ 고양이.jpg
│  │     ├─ 국수, 면.jpg
│  │     ├─ 낙지.jpg
│  │     ├─ 드레스.jpg
│  │     ├─ 떡.jpg
│  │     ├─ 만화.jpg
│  │     ├─ 맥주.jpg
│  │     ├─ 무지개.jpg
│  │     ├─ 미소.jpg
│  │     ├─ 미안하다, 죄송하다.jpg
│  │     ├─ 벼락.jpg
│  │     ├─ 별.jpg
│  │     ├─ 빵.jpg
│  │     ├─ 산.jpg
│  │     ├─ 어지럽다.jpg
│  │     ├─ 엿.jpg
│  │     ├─ 온도.jpg
│  │     └─ 칫솔.jpg
│  ├─ css
│  │  ├─ auth
│  │  │  ├─ changePw.css
│  │  │  ├─ findPw.css
│  │  │  ├─ findPwVerify.css
│  │  │  ├─ home.css
│  │  │  ├─ login.css
│  │  │  ├─ loginHome.css
│  │  │  ├─ register.css
│  │  │  ├─ verify.css
│  │  │  └─ welcome.css
│  │  ├─ game
│  │  │  ├─ play.css
│  │  │  └─ start.css
│  │  ├─ imitate
│  │  │  └─ imitate.css
│  │  ├─ layouts
│  │  │  ├─ footer.css
│  │  │  ├─ header.css
│  │  │  └─ home.css
│  │  ├─ learn
│  │  │  ├─ learnFrame.css
│  │  │  ├─ result.css
│  │  │  └─ wrong.css
│  │  ├─ mypage
│  │  │  ├─ modal.css
│  │  │  └─ mypage.css
│  │  └─ quiz
│  │     └─ quiz.css
│  └─ js
│     ├─ auth
│     │  ├─ changePw.js
│     │  └─ register.js
│     ├─ game
│     │  ├─ play.js
│     │  └─ start.js
│     ├─ imitate
│     │  ├─ camera.js
│     │  ├─ imitate.js
│     │  ├─ renderImitate.js
│     │  └─ renderImitateWrong.js
│     ├─ mypage.js
│     └─ quiz
│        ├─ bookmark.js
│        ├─ renderQuiz.js
│        └─ renderQuizWrong.js
├─ routers
│  ├─ auth.js
│  ├─ gameRouter.js
│  ├─ imitateRouter.js
│  ├─ learnRouter.js
│  ├─ predictRouter.js
│  ├─ quizRouter.js
│  └─ userRouter.js
├─ services
│  ├─ authService.js
│  ├─ gameService.js
│  ├─ imitateService.js
│  ├─ mypageService.js
│  └─ quizService.js
└─ views
   ├─ auth
   │  ├─ changePw.ejs
   │  ├─ findPw.ejs
   │  ├─ findPwVerify.ejs
   │  ├─ home.ejs
   │  ├─ login.ejs
   │  ├─ loginHome.ejs
   │  ├─ register.ejs
   │  ├─ verify.ejs
   │  └─ welcome.ejs
   ├─ game
   │  ├─ play.ejs
   │  └─ start.ejs
   ├─ imitate
   │  ├─ imitatePage.ejs
   │  ├─ imitateResult.ejs
   │  ├─ imitateSelect.ejs
   │  └─ imitateWrong.ejs
   ├─ layouts
   │  ├─ footer.ejs
   │  ├─ header.ejs
   │  └─ home.ejs
   ├─ learn
   │  └─ learn.ejs
   ├─ mypage
   │  ├─ bookmarkDetail.ejs
   │  ├─ mypage.ejs
   │  └─ nouser.ejs
   └─ quiz
      ├─ noQuiz.ejs
      ├─ quizMenu.ejs
      ├─ quizPage.ejs
      ├─ quizResult.ejs
      └─ quizWrong.ejs

```

## 💻 손새김 Link!

[손으로 새기며 배워보세요 !](https://sonsaekim.site/)
