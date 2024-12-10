import os
import tempfile
from flask import Flask, request, jsonify
import cv2
import numpy as np
from roboflow import Roboflow

app = Flask(__name__)

# Initialize Roboflow model
rf = Roboflow(api_key="5HmOkT6MocgLS0cj2L9N")
project = rf.workspace().project("teeth-segmentation-qbm71-keaeh")
model = project.version("1").model

@app.route('/segment', methods=['POST'])
def segment_teeth():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # Save the image to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        cv2.imwrite(temp_file.name, img)
        temp_file_path = temp_file.name

    try:
        # Perform segmentation using the Roboflow model
        result = model.predict(temp_file_path).json()
    finally:
        # Delete the temporary file
        os.remove(temp_file_path)

    return jsonify(result)

if __name__ == '__main__':
    app.run()