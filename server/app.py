from flask import Flask, request, jsonify
from keras.src.utils import load_img, img_to_array
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt  # Only needed for debugging (optional)
import tensorflow as tf
import numpy as np
import os
import cv2
from tensorflow.keras.models import load_model
from flask_cors import CORS

# Adjust these paths as needed
model_path = 'XAI2.h5'
upload_folder = 'D:\Implementation\InsightMRI\client\src\Components\savedmaps'

model_path_predict = "Tumors.h5"
model_predict = load_model(model_path_predict)
class_names_mapping = {0: 'NoTumor', 1: 'Glioma', 2: 'Meningioma', 3: 'Pituitary'}
last_conv_layer_name = 'top_conv'


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = upload_folder

# Load the trained model (place outside a function for global access)
model = load_model(model_path)

def preprocess_image(image_path, target_size=(240, 240)):
    # Load the image file, resizing it to the target size and converting it to RGB
    img = load_img(image_path, target_size=target_size, color_mode="rgb")  # Changed to "rgb"
    img = img_to_array(img)
    img /= 255.0  # Normalize the image
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

def predictTumor(image_path):
    img_tensor = preprocess_image(image_path)
    predictions = model_predict.predict(img_tensor)
    predicted_class_index = np.argmax(predictions, axis=1)[0]  # Get the index of the max logit
    predicted_class_name = class_names_mapping[predicted_class_index]  # Map index to class name

    return predicted_class_name


def generate_heatmap(image_path, last_conv_layer_name):
    img_size = (240, 240)
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=img_size)
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Model expects a batch

    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        top_pred_index = tf.argmax(preds[0])
        top_class_channel = preds[:, top_pred_index]

    grads = tape.gradient(top_class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    heatmap = heatmap.numpy()

    heatmap = cv2.resize(heatmap, (img_size[1], img_size[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    if img_array.max() > 1:
        img_array = img_array / 255.0
    if img_array.dtype != np.uint8:
        img_array = np.uint8(255 * img_array)

    superimposed_img = cv2.addWeighted(img_array[0], 0.6, heatmap, 0.4, 0)

    # Save the heatmap image (optional)
    heatmap_path = f"{upload_folder}/heatmap_{secure_filename(image_path)}"
    cv2.imwrite(heatmap_path, superimposed_img)

    return heatmap_path  # Return the path to the saved heatmap

@app.route('/explain', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    filename = secure_filename(image.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(image_path)

    last_conv_layer_name = 'top_conv'

    prediction = predictTumor(image_path)
    print(prediction)
    try:
        heatmap_path = generate_heatmap(image_path, last_conv_layer_name)
        return jsonify({'heatmap_path': heatmap_path, 'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '_main_':
    app.run(debug=True)