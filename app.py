from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import os
from io import BytesIO
from PIL import Image

# Import your hand detection and prediction logic
from inference_classifier import predict_hand_letter

app = Flask(__name__, template_folder='templates', static_folder='static')

# Ensure a directory for processed images exists
# This is where images with drawings will be saved temporarily
if not os.path.exists('static/processed_images'):
    os.makedirs('static/processed_images')

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles image prediction requests for both webcam captures and uploads.
    It expects an image file and returns the predicted letter and a path
    to the processed image (for uploads).
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected image file'}), 400

    try:
        # Read the image file and convert to NumPy array
        in_memory_file = BytesIO()
        file.save(in_memory_file)
        data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
        image_np = cv2.imdecode(data, cv2.IMREAD_COLOR)

        if image_np is None:
            return jsonify({'error': 'Could not decode image. Invalid image format?'}), 400

        # Perform prediction using your hand_detector
        predicted_letter, processed_image_bgr = predict_hand_letter(image_np)

        if predicted_letter is None or isinstance(processed_image_bgr, str):
            # If predict_hand_letter returns an error message as processed_image_bgr
            return jsonify({'error': processed_image_bgr}), 500

        # Convert processed_image_bgr (OpenCV BGR) to RGB for PIL and web display
        processed_image_rgb = cv2.cvtColor(processed_image_bgr, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(processed_image_rgb)
        
        # Save the processed image temporarily to serve it
        # This creates a unique filename to avoid caching issues
        img_filename = f"processed_image_{np.random.randint(0, 100000)}.jpg"
        img_path = os.path.join(app.static_folder, 'processed_images', img_filename)
        pil_img.save(img_path)

        return jsonify({
            'letter': predicted_letter,
            'processed_image': f"/static/processed_images/{img_filename}"
        })

    except Exception as e:
        app.logger.error(f"Error during prediction: {e}")
        return jsonify({'error': f'Server error during prediction: {str(e)}. Check server logs.'}), 500

# The /upload route can simply call /predict as the logic is the same
@app.route('/upload', methods=['POST'])
def upload_image():
    return predict()


if __name__ == '__main__':
    # Run the Flask development server
    # debug=True allows for automatic reloading on code changes and provides more detailed error messages
    app.run(debug=True)