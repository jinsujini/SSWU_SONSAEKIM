from flask import Flask, request, jsonify
import cv2
import numpy as np
import os
import tensorflow as tf
import modules.holistic_module as hm
from modules.utils import Vector_Normalization

app = Flask(__name__)

# 자모 클래스
actions = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
           'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
           'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅢ', 'ㅚ', 'ㅟ']

# 모델 및 Detector 로딩
detector = hm.HolisticDetector(min_detection_confidence=0.3)
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'models', 'multi_hand_gesture_classifier.tflite'))
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files.get('image')
    if not file:
        return jsonify({'predicted': '이미지 없음', 'confidence': 0})

    # 이미지 저장
    temp_path = os.path.join(os.path.dirname(__file__), 'temp_image.jpg')
    file.save(temp_path)
    img = cv2.imread(temp_path)
    if img is None:
        return jsonify({'predicted': '이미지 읽기 실패', 'confidence': 0})

    # Mediapipe 손 검출
    img = detector.findHolistic(img, draw=False)
    _, right_hand_lmList = detector.findRighthandLandmark(img)

    if right_hand_lmList is None:
        return jsonify({'predicted': '손 인식 실패', 'confidence': 0})

    # 벡터 + 각도 정규화
    joint = np.zeros((21, 2))
    for j, lm in enumerate(right_hand_lmList.landmark):
        joint[j] = [lm.x, lm.y]
    vector, angle_label = Vector_Normalization(joint)
    d = np.concatenate([vector.flatten(), angle_label.flatten()])

    input_data = np.expand_dims([d] * 10, axis=0).astype(np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output = interpreter.get_tensor(output_details[0]['index'])

    i_pred = int(np.argmax(output[0]))
    conf = float(output[0][i_pred])
    result = actions[i_pred] if conf >= 0.9 else '확신 부족'

    return jsonify({'predicted': result, 'confidence': conf})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
