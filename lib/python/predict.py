import sys
import numpy as np
import cv2
import mediapipe as mp
import tensorflow as tf
import os

# 모델 경로 설정
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'multi_hand_gesture_classifier.tflite'))

# Mediapipe 초기화
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1)

# 이미지 경로 받기
image_path = sys.argv[1]

# 이미지 불러오기
image = cv2.imread(image_path)
if image is None:
    print(-1)
    sys.exit(1)

# 손 추출
results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
if not results.multi_hand_landmarks:
    print(-1)
    sys.exit(1)

landmarks = results.multi_hand_landmarks[0]
input_data = np.array([[lm.x, lm.y, lm.z] for lm in landmarks.landmark]).flatten().astype(np.float32)

# TFLite 모델 로딩 및 추론
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_index = interpreter.get_input_details()[0]['index']
output_index = interpreter.get_output_details()[0]['index']

interpreter.set_tensor(input_index, [input_data])
interpreter.invoke()
output = interpreter.get_tensor(output_index)

# 가장 높은 확률의 클래스 출력
predicted_class = int(np.argmax(output))
print(predicted_class)
