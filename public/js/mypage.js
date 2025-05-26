//이메일 변경 모달 조작
function openEmailModal() {
    document.getElementById("emailModal").style.display = "flex";
}

function closeEmailModal() {
    document.getElementById("emailModal").style.display = "none";
}

let verificationPassed = false;
let resendCooldown = false;

//타이머
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startResendTimer() {
  const button = document.getElementById("sub-btn");
  const timerDisplay = document.getElementById("timer");
  let timeLeft = 90;

  resendCooldown = true;
  button.disabled = true;
  button.classList.add("disabled");
  timerDisplay.style.display = "inline";
  timerDisplay.textContent = formatTime(timeLeft);

  const interval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(interval);
      resendCooldown = false;
      button.disabled = false;
      button.classList.remove("disabled");
      timerDisplay.style.display = "none";
    }
  }, 1000);
}

//이메일 인증번호 발송 
async function sendVerificationCode() {
  if (resendCooldown) {
    alert("잠시만 기다려주세요");
    return;
  }

  const email = document.getElementById("newEmail").value.trim();
  if (!email) {
    alert("이메일을 입력해주세요");
    return;
  }

  try {
    const res = await fetch('/sendEmailCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "전송에 실패했습니다.");
      return;
    }

    const result = await res.json();
    if (result.success) {
      document.getElementById("verificationCode").disabled = false;
      alert("인증번호가 전송되었습니다.");
      startResendTimer();
    }
  } catch (err) {
    console.error("전송 실패:", err);
    alert("서버 오류 발생");
  }
}
// 이메일 인증 확인
async function verifyCode() {
  const email = document.getElementById("newEmail").value.trim();
  const code = document.getElementById("verificationCode").value;

  try {
    const res = await fetch('/verifyEmailCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email })
    });

    const result = await res.json();
    if (result.success) {
      document.getElementById("emailSuccess").style.display = "flex";
      document.getElementById("emailError").style.display = "none";
      verificationPassed = true;
    } else {
      document.getElementById("emailError").style.display = "flex";
      document.getElementById("emailSuccess").style.display = "none";
      verificationPassed = false;
    }
  } catch (err) {
    console.error("검증 실패:", err);
    alert("서버 오류 발생");
  }
}
// 인증된 이메일인지 확인
function validateEmailCode() {
  if (!verificationPassed) {
    alert("이메일 인증을 먼저 완료해주세요");
    return false;
  }
  return true;
}

// 이름 변경 버튼 조작
let isEditingName = false;

async function toggleNameEdit() {
    const nameInput = document.getElementById("nameInput");
    const nameBtn = document.getElementById("nameBtn");

    if (!isEditingName) {
        nameInput.disabled = false;
        nameInput.focus();
        nameBtn.textContent = "저장";
        isEditingName = true;
    } else {
        const newName = nameInput.value.trim();
        if (!newName) {
            alert("이름을 입력해주세요 ∼");
            return;
        }

        try {
            const res = await fetch('/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName })
            });

            const result = await res.json();
            if (result.success) {
                alert("이름 변경 성공했어요!");
                nameInput.disabled = true;
                nameBtn.textContent = "변경";
                isEditingName = false;
                location.reload();

            } else {
                alert("이름 변경 실패했어요.");
            }
        } catch (err) {
            console.error("요청 실패:", err);
            alert("서버 오류가 발생");
        }
    }
}
