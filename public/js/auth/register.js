const pw1 = document.getElementById('password');
const pw2 = document.getElementById('password2');
const msg = document.getElementById('pw-error-msg');

pw1.addEventListener('input', checkPasswordMatch);
pw2.addEventListener('input', checkPasswordMatch);

function checkPasswordMatch() {
  if (pw1.value === '' || pw2.value === '') {
    msg.innerText = '';
    return;
  }
  if (pw1.value === pw2.value) {
    msg.innerText = '비밀번호가 일치합니다.';
    msg.className = 'success-text';
  } else {
    msg.innerText = '비밀번호가 일치하지 않습니다.';
    msg.className = 'error-text red';
  }
}

document.getElementById('checkEmailBtn').addEventListener('click', async () => {
  const emailInput = document.getElementById('email').value;
  const response = await fetch(`/auth/check-email?email=${emailInput}`);
  const result = await response.json();

  const btn = document.getElementById('checkEmailBtn');
  const statusText = document.getElementById('emailStatusText');

  if (result.exists) {
    statusText.innerText = '이미 존재하는 이메일입니다.';
    statusText.style.color = '#FF4B4B';
    btn.style.backgroundColor = '#B6B6B6';
  } else {
    statusText.innerText = '사용 가능한 이메일입니다!';
    statusText.style.color = '#22964A';
    btn.style.backgroundColor = '#22964A';
  }
});

console.log('register.js 로딩 완료!');
