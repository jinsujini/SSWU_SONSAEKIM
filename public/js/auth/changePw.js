const pw1 = document.getElementById('newPassword');
const pw2 = document.getElementById('confirmPassword');
const msg = document.getElementById('pw-error-msg');
const form = document.querySelector('form');

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

form.addEventListener('submit', function (e) {
  if (pw1.value !== pw2.value) {
    e.preventDefault();
    msg.innerText = '비밀번호가 일치하지 않습니다.';
    msg.className = 'error-text red';
  }
});