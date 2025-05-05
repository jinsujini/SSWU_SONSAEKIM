const falling = document.querySelector('.falling-img');
const inputBox = document.querySelector('#user-input');

// 이미지 일정 위치까지 떨어지면 제거
falling.addEventListener('animationiteration', () => {
  falling.remove(); 
});
