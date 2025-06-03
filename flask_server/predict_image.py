import cv2
import numpy as np
import tensorflow as tf
import os

from modules.utils import Vector_Normalization
import modules.holistic_module as hm

# 자모 클래스
actions = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
           'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
           'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅢ', 'ㅚ', 'ㅟ']

# 공통 객체 초기화
detector = hm.HolisticDetector(min_detection_confidence=0.3)

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir,  'models', 'multi_hand_gesture_classifier.tflite')
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def predict_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return '이미지 읽기 실패', 0.0

    img = detector.findHolistic(img, draw=False)
    _, hand_lmList = detector.findRighthandLandmark(img)
    if hand_lmList is None:
        _, hand_lmList = detector.findLefthandLandmark(img)
        if hand_lmList is None:
            return '손 인식 실패', 0.0

    joint = np.zeros((21, 2))
    for j, lm in enumerate(hand_lmList.landmark):
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

    return result, conf
