async function captureAndPredict(video, correctText, mode) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

  const formData = new FormData();
  formData.append('image', blob, 'capture.jpg');
  formData.append('correctText', correctText);
  formData.append('mode', mode);

  const response = await fetch('/api/predict', {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  console.log(result);
  if (!result.isValid) {
    alert('모드에 맞지 않는 글자입니다');
  } else if (result.isCorrect) {
    alert('정답입니다');
  } else {
    alert(`오답입니다 (${result.predicted})`);
  }
}
