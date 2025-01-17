from flask import Blueprint, request, jsonify, current_app
import cv2
import numpy as np
import tempfile
import os
import torch

RISK_COLORS = {
    "Low risk": (0, 255, 0),      # Green
    "Medium risk": (255, 165, 0),  # Orange
    "High risk": (255, 0, 0)       # Red
}

# Risk level mapping
RISK_LEVELS = {
    0: "Low risk",    # Implant
    1: "Low risk",    # Prosthetic restoration
    2: "Low risk",    # Obturation
    3: "Low risk",    # Endodontic treatment
    12: "Low risk",   # Orthodontic device
    13: "Low risk",   # Surgical device
    4: "Medium risk", # Carious lesion
    5: "Medium risk", # Bone resorbtion
    6: "Medium risk", # Impacted tooth
    10: "Medium risk",# Apical surgery
    7: "High risk",   # Apical periodontitis
    8: "High risk",   # Root fragment
    9: "High risk",   # Furcation lesion
    11: "High risk"   # Root resorption
}

class_names = {
    0: "Implant",
    1: "Prosthetic restoration",
    2: "Obturation",
    3: "Endodontic treatment",
    12: "Orthodontic device",
    13: "Surgical device",
    4: "Carious lesion",
    5: "Bone resorbtion",
    6: "Impacted tooth",
    10: "Apical surgery",
    7: "Apical periodontitis",
    8: "Root fragment",
    9: "Furcation lesion",
    11: "Root resorption"
}

main = Blueprint('main', __name__)

@main.route('/vulnerabilities', methods=['POST'])
def segment_teeth2():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)


    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        temp_img_path = temp_file.name
        cv2.imwrite(temp_img_path, img)

    predictions = []
    try:
        with torch.no_grad():
            results = current_app.yolo_model(img)

            for result in results:
                for box in result.boxes:
                    class_id = int(box.cls)
                    class_name = class_names[class_id]
                    risk_level = RISK_LEVELS[class_id]
                    confidence = float(box.conf)
                    x1, y1, x2, y2 = [int(v) for v in box.xyxy[0]]

                    predictions.append({
                        'bbox': [x1, y1, x2, y2],
                        'class': class_id,
                        'confidence': confidence,
                        'class_name': class_name,
                        'risk_level': risk_level.split()[0]
                    })
                    cv2.rectangle(img, (x1, y1), (x2, y2), (36, 255, 12), 2)
                    cv2.putText(img, f"{class_name} ({risk_level})", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                (36, 255, 12), 2)
    finally:
        os.remove(temp_img_path)

    output_path = 'output.png'
    if cv2.imwrite(output_path, img):
        print(f"Image saved successfully to {output_path}")
    else:
        print(f"Failed to save image to {output_path}")
    return jsonify(predictions)

@main.route('/segment', methods=['POST'])
def segment_teeth():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        cv2.imwrite(temp_file.name, img)
        temp_file_path = temp_file.name

    try:
        result = current_app.roboflow_model.predict(temp_file_path).json()
    finally:
        os.remove(temp_file_path)

    for prediction in result['predictions']:
        class_id = int(prediction['class'])
        points = [(int(p['x']), int(p['y'])) for p in prediction['points']]
        points = np.array(points, np.int32)
        points = points.reshape((-1, 1, 2))
        cv2.polylines(img, [points], isClosed=True, color=(36, 255, 12), thickness=2)
        cv2.putText(img, f"{class_id}", points[0][0], cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 100, 100), 2)
    output_path = 'output2.png'
    if cv2.imwrite(output_path, img):
        print(f"Image saved successfully to {output_path}")
    else:
        print(f"Failed to save image to {output_path}")

    return jsonify(result)