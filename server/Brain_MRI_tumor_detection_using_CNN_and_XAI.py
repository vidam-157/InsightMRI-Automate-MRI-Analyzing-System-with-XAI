import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Dropout, Flatten
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from sklearn.model_selection import train_test_split

# Set seed for reproducibility
SEED = 111
tf.random.set_seed(SEED)
np.random.seed(SEED)
os.environ['PYTHONHASHSEED'] = str(SEED)

# Constants
IMAGE_SIZE = (240, 240)
BATCH_SIZE = 32
EPOCHS = 25
N_CLASSES = 4  # Adjust according to your dataset

# Data loading and preprocessing
def load_and_preprocess_image(path):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, IMAGE_SIZE)
    img /= 255.0
    return img

def prepare_dataset(paths, labels, batch_size=BATCH_SIZE):
    path_ds = tf.data.Dataset.from_tensor_slices(paths)
    image_ds = path_ds.map(load_and_preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
    label_ds = tf.data.Dataset.from_tensor_slices(tf.cast(labels, tf.int64))
    image_label_ds = tf.data.Dataset.zip((image_ds, label_ds))
    dataset = image_label_ds.shuffle(buffer_size=len(paths)).batch(batch_size).prefetch(buffer_size=tf.data.AUTOTUNE)
    return dataset

def load_data_paths_labels(base_dir):
    
    paths = []
    labels = []
    
    # Process 'NoTumor' images
    no_tumor_dir = os.path.join(base_dir, "NoTumor")
    for fname in os.listdir(no_tumor_dir):
        if fname.endswith(('.png', '.jpg', '.jpeg')):
            paths.append(os.path.join(no_tumor_dir, fname))
            labels.append('NoTumor')
    
    # Process 'Tumor' images
    tumor_types = ['Glioma', 'Meningioma', 'Pituitary']
    for tumor_type in tumor_types:
        tumor_dir = os.path.join(base_dir, "Tumor", tumor_type)
        for fname in os.listdir(tumor_dir):
            if fname.endswith(('.png', '.jpg', '.jpeg')):
                paths.append(os.path.join(tumor_dir, fname))
                labels.append(tumor_type)
    
    return paths, labels

# Load image paths and their labels
USER_PATH = "D:/Implementation/Kaggle97"  # Adjust as necessary
paths, labels = load_data_paths_labels(USER_PATH)

# Convert labels to integers
label_to_int = {'NoTumor': 0, 'Glioma': 1, 'Meningioma': 2, 'Pituitary': 3}
labels = [label_to_int[label] for label in labels]

# Split the data into training and testing sets
train_paths, test_paths, train_labels, test_labels = train_test_split(paths, labels, test_size=0.2, random_state=SEED)

# Convert labels to one-hot encoding
train_labels = tf.keras.utils.to_categorical(train_labels, num_classes=len(label_to_int))
test_labels = tf.keras.utils.to_categorical(test_labels, num_classes=len(label_to_int))


# Convert labels to one-hot encoding
train_labels = tf.one_hot(train_labels, depth=N_CLASSES)
test_labels = tf.one_hot(test_labels, depth=N_CLASSES)

# Prepare TensorFlow datasets
train_dataset = prepare_dataset(train_paths, train_labels)
test_dataset = prepare_dataset(test_paths, test_labels)

# Model definition
model = tf.keras.Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(*IMAGE_SIZE, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(N_CLASSES, activation='softmax')
])

model.compile(optimizer=Adam(), loss='categorical_crossentropy', metrics=['accuracy'])

# Callbacks
callbacks = [
    EarlyStopping(monitor='val_loss', patience=5),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2),
    ModelCheckpoint(filepath='best_model.h5', monitor='val_accuracy', save_best_only=True)
]

# Train the model
history = model.fit(
    train_dataset,
    epochs=EPOCHS,
    validation_data=test_dataset,
    callbacks=callbacks
)

# Load the best model and evaluate on test data
best_model = load_model('Tumors.h5')
test_loss, test_acc = best_model.evaluate(test_dataset)
print(f"Test Accuracy: {test_acc:.4f}")

# Prediction example
def make_prediction(model, image_path):
    img = load_and_preprocess_image(image_path)
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    prediction = model.predict(img)
    predicted_class = np.argmax(prediction, axis=1)[0]
    return predicted_class

# Example usage
image_path = 'path/to/your/image.jpg'
predicted_class = make_prediction(best_model, image_path)
print(f"Predicted Class: {predicted_class}")