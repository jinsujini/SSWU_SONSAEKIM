from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from predict_image import predict_image

app = Flask(__name__)
CORS(app)

@app.route('/flask-predict', methods=['POST'])
def predict():
    file = request.files.get('image')
    if not file:
        return jsonify({'predicted': '이미지 없음', 'confidence': 0})

    # 이미지 임시 저장
    temp_path = os.path.join(os.path.dirname(__file__), 'temp', 'image.jpg')
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    file.save(temp_path)

    # 예측 실행
    predicted, confidence = predict_image(temp_path)
    return jsonify({'predicted': predicted, 'confidence': confidence})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
