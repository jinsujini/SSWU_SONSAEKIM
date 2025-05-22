
// 비밀번호 모달 조작
function openPasswordModal() {
    document.getElementById("passwordModal").style.display = "flex";
}

function closePasswordModal() {
    document.getElementById("passwordModal").style.display = "none";

}

function validatePassword() {
    const newPw = document.getElementById("newPassword").value;
    const confirmPw = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    if (newPw !== confirmPw) {
        errorMessage.style.display = "block";
        return false;
    }

    errorMessage.style.display = "none";
    return true;
}
window.onclick = function (event) {
    const modal = document.getElementById("passwordModal");
    if (event.target == modal) {
        closePasswordModal();
    }
}

//이메일 변경 모달 조작
function openEmailModal() {
    document.getElementById("emailModal").style.display = "flex";
}

function closeEmailModal() {
    document.getElementById("emailModal").style.display = "none";
}

//추후 수정해야하는 부분, 인증 확인 로직 추가
function sendVerificationCode() {
    document.getElementById("verificationCode").disabled = false;
    alert("인증번호가 전송되었습니다.");
}

function verifyCode() {
    const code = document.getElementById("verificationCode").value;

    if (code === "123456") {
        document.getElementById("emailSuccess").style.display = "flex";
        document.getElementById("emailError").style.display = "none";
    } else {
        document.getElementById("emailError").style.display = "flex";
        document.getElementById("emailSuccess").style.display = "none";
    }
}

function validateEmailCode() {
    const successMsg = document.getElementById("emailSuccess").style.display;
    if (successMsg !== "block") {
        alert("인증을 먼저 완료해주세요 ∼");
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
