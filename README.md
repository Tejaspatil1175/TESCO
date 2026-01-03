# 🤖 RetailSync AI – Training Pipeline

## Overview

This repository contains the complete **machine learning training pipeline** for **RetailSync AI**, focused on:

- **Ad Quality Scoring** (0–100)
- **Creative Compliance Prediction** (Pass / Fail)

The pipeline trains a **custom CNN model**, exports it for **browser-based inference using TensorFlow.js**, and generates all required logs, metrics, and model artifacts for evaluation and deployment.

This project is designed as a **production-ready proof of concept** that can be extended using real-world retail ad datasets.

---

## 📂 Project Structure

training/
├── train_ad_quality_model.py # Main training script
├── prepare_data.py # Synthetic data generation
├── inference.py # Model inference & testing
├── requirements.txt # Python dependencies
└── README.md # Documentation

models/
├── ad_quality_model_latest.keras
├── ad_quality_model_YYYYMMDD.keras
├── best_model.keras
├── tfjs_model/
│ ├── model.json
│ └── group1-shard*.bin
└── model_metadata.json

logs/
├── training_curves.png
└── training_log.json

data/
├── synthetic_ads/
└── dataset_metadata.json

yaml
Copy code

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
cd training
pip install -r requirements.txt
Requirements

Python 3.8+

TensorFlow 2.15+

~2GB free disk space

GPU optional (recommended)

2️⃣ Generate Training Data (Optional)
bash
Copy code
python prepare_data.py
Generates synthetic ad images with multiple quality levels

Automatically handled by the training script if missing

3️⃣ Train the Model
bash
Copy code
python train_ad_quality_model.py
Training Pipeline

Generates ~1000 synthetic samples

Builds a CNN architecture from scratch

Trains with early stopping

Saves the best-performing model

Exports model to TensorFlow.js

Generates logs and training curves

⏱ Training Time

CPU: ~5–10 minutes

GPU: ~2–3 minutes

4️⃣ Test Model Inference
bash
Copy code
python inference.py
Runs predictions on sample images and outputs:

Quality score

Compliance probability

🧠 Model Architecture
Input: RGB Images (224 × 224 × 3)

scss
Copy code
Data Augmentation
↓
Conv2D(32) + MaxPool + BatchNorm
↓
Conv2D(64) + MaxPool + BatchNorm
↓
Conv2D(128) + MaxPool + BatchNorm
↓
Conv2D(256) + GlobalAveragePooling
↓
Dense(256) + Dropout(0.4)
↓
Dense(128) + Dropout(0.3)
↓
Output (2 values)
Trainable Parameters: ~2.5M

Model Outputs
Quality Score: Continuous value (0–100)

Compliance Probability: Value between 0 and 1

⚙️ Training Configuration
python
Copy code
CONFIG = {
    'img_height': 224,
    'img_width': 224,
    'batch_size': 32,
    'epochs': 20,
    'learning_rate': 0.001,
    'seed': 42
}
Dataset Split

Training: 70%

Validation: 15%

Test: 15%

Callbacks

Early stopping

Learning rate reduction

Best model checkpointing

🧪 Synthetic Data Strategy
The model is trained using procedurally generated ad creatives.

Quality Categories
High Quality

Good contrast

Structured layout

Multiple design elements

Medium Quality

Partial structure

Moderate contrast

Fewer elements

Low Quality

Poor contrast

Unstructured layout

Minimal elements

Why Synthetic Data?
No manual labeling required

Fast and scalable

Ideal for prototyping and validation

For production use, replace synthetic data with human-labeled retail ad datasets.

📈 Expected Performance
After ~18–20 epochs:

Training Loss: ~150–250

Validation Loss: ~200–300

MAE (Quality Score): ~10–15 points

Compliance Accuracy: ~85–95%

Example Predictions

yaml
Copy code
True: [85.3, 1] | Pred: [82.1, 0.89]
True: [45.7, 0] | Pred: [48.2, 0.32]
True: [92.1, 1] | Pred: [88.5, 0.95]
🌐 Browser Deployment (TensorFlow.js)
The trained model is automatically exported to TensorFlow.js.

Load Model
javascript
Copy code
const model = await tf.loadLayersModel('models/tfjs_model/model.json');
Run Inference
javascript
Copy code
const img = tf.browser.fromPixels(imageElement)
  .resizeBilinear([224, 224])
  .expandDims(0)
  .toFloat();

const [quality, compliance] = await model.predict(img).data();
🧩 Editor Integration Example
javascript
Copy code
async function analyzeAd(canvas) {
  const img = tf.browser.fromPixels(canvas.lowerCanvasEl)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .toFloat();

  const [quality, compliance] = await aiModel.predict(img).data();

  return {
    qualityScore: Math.round(quality),
    compliance: compliance > 0.5 ? 'Pass' : 'Fail'
  };
}
🛠 Troubleshooting
TensorFlow not installed

bash
Copy code
pip install tensorflow
TensorFlow.js converter issue

bash
Copy code
pip install tensorflowjs --upgrade
Slow training

Reduce epochs

Reduce dataset size

Use GPU

High memory usage

Reduce batch size

Reduce image resolution

📦 Model Artifacts
File	Description
ad_quality_model_latest.keras	Main trained model
best_model.keras	Best validation checkpoint
tfjs_model/	Browser-ready model
training_curves.png	Training metrics visualization
model_metadata.json	Model configuration & stats

🔮 Future Improvements
Train on real retail ad datasets

Transfer learning (EfficientNet / ResNet)

OCR-based text analysis

Color harmony evaluation

REST API deployment

Continuous retraining pipeline

📚 References
TensorFlow: https://www.tensorflow.org/

Keras: https://keras.io/

TensorFlow.js: https://www.tensorflow.org/js

👤 Author
RetailSync AI – ML Training Pipeline
Built for scalable, browser-first AI creative analysis.