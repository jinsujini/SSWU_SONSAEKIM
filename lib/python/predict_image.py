import cv2
import sys
import numpy as np
import mediapipe as mp
import tensorflow as tf
import os
import json
import io
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')  # 강제로 utf-8로 재설정

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.abspath(os.path.join(current_dir, '..', '..')))

from modules.utils import Vector_Normalization
import modules.holistic_module as hm

# 사용할 자모 클래스 목록
actions = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
           'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
           'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅢ', 'ㅚ', 'ㅟ']

# mediapipe detector
detector = hm.HolisticDetector(min_detection_confidence=0.3)

# 모델 로딩
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'multi_hand_gesture_classifier.tflite'))
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def predict_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"이미지를 찾을 수 없음: {image_path}")

    # 손 랜드마크 추출
    img = detector.findHolistic(img, draw=False)
    _, right_hand_lmList = detector.findRighthandLandmark(img)

    if right_hand_lmList is None:
        return '손 인식 실패', None

    joint = np.zeros((21, 2))
    for j, lm in enumerate(right_hand_lmList.landmark):
        joint[j] = [lm.x, lm.y]

    vector, angle_label = Vector_Normalization(joint)
    d = np.concatenate([vector.flatten(), angle_label.flatten()])

    # 시퀀스 모양 맞추기용 (동일한 프레임 10개 복사)
    input_data = np.array([d] * 10, dtype=np.float32)  # [10, feature_dim]
    input_data = np.expand_dims(input_data, axis=0)   # [1, 10, feature_dim]

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output = interpreter.get_tensor(output_details[0]['index'])

    i_pred = int(np.argmax(output[0]))
    conf = output[0][i_pred]

    if conf < 0.8:
        return '확신 부족', conf

    return actions[i_pred], conf


# 예측 실행부
if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print(json.dumps({ "predicted": "입력 오류", "confidence": 0 }))
        sys.exit(1)

    image_path = sys.argv[1]
    result, confidence = predict_image(image_path)

    output = {
        "predicted": result,
        "confidence": float(confidence) if confidence is not None else 0.0
    }

    print(json.dumps(output, ensure_ascii=False))  # ← 핵심!
