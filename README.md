# 🤖 RetailSync AI - Training Pipeline

## Overview

This directory contains the complete training pipeline for RetailSync AI's **Ad Quality Scoring** and **Compliance Prediction** models.

---

## 📂 Directory Structure

```
training/
├── train_ad_quality_model.py    # Main training script
├── prepare_data.py               # Data preparation & generation
├── inference.py                  # Model inference/testing
├── requirements.txt              # Python dependencies
└── README.md                     # This file

Generated after training:
../models/
├── ad_quality_model_latest.keras    # Trained model (Keras format)
├── ad_quality_model_YYYYMMDD.keras  # Timestamped backup
├── best_model.keras                  # Best model checkpoint
├── tfjs_model/                       # TensorFlow.js web format
│   ├── model.json
│   └── group1-shard*.bin
└── model_metadata.json               # Training metadata

../logs/
├── training_curves.png           # Loss & MAE plots
└── training_log.json             # Detailed training history

../data/
├── synthetic_ads/                # Generated training images
└── dataset_metadata.json         # Dataset info
```

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd training
pip install -r requirements.txt
```

**Requirements:**
- Python 3.8+
- TensorFlow 2.15+
- 2GB free disk space
- GPU (optional, speeds up training)

### Step 2: Prepare Data (Optional)

```bash
python prepare_data.py
```

This generates 200 synthetic ad images with varying quality levels. The main training script will also generate data automatically if needed.

### Step 3: Train Model

```bash
python train_ad_quality_model.py
```

**Training time:** ~5-10 minutes on CPU, ~2-3 minutes on GPU

**What happens:**
1. Generates 1000 synthetic training samples
2. Builds CNN model architecture
3. Trains for up to 20 epochs (with early stopping)
4. Saves model in multiple formats
5. Generates training curves and logs

### Step 4: Test Model

```bash
python inference.py
```

Tests the trained model on sample images from `../assets/` folder.

---

## 🎯 Model Architecture

**Input:** RGB images (224×224×3)

**Architecture:**
```
- Data Augmentation (flip, rotate, zoom)
- Conv2D(32) + MaxPool + BatchNorm
- Conv2D(64) + MaxPool + BatchNorm
- Conv2D(128) + MaxPool + BatchNorm
- Conv2D(256) + GlobalAvgPool
- Dense(256) + Dropout(0.4)
- Dense(128) + Dropout(0.3)
- Output: Dense(2) → [quality_score, compliance_prob]
```

**Parameters:** ~2.5M trainable parameters

**Outputs:**
1. **Quality Score** (0-100): Overall ad quality rating
2. **Compliance** (0-1): Probability of passing compliance rules

---

## 📊 Training Configuration

```python
CONFIG = {
    'img_height': 224,
    'img_width': 224,
    'batch_size': 32,
    'epochs': 20,
    'learning_rate': 0.001,
    'seed': 42
}
```

**Data Split:**
- Training: 70% (700 samples)
- Validation: 15% (150 samples)
- Test: 15% (150 samples)

**Callbacks:**
- Early stopping (patience=5)
- Learning rate reduction (factor=0.5, patience=3)
- Model checkpointing (saves best model)

---

## 🔬 Training Process

### Synthetic Data Generation

The model is trained on procedurally generated synthetic ad images:

**High Quality (Score: 70-100, Compliance: Pass)**
- Structured rectangles (simulating text/images)
- Good contrast and composition
- 3+ design elements

**Medium Quality (Score: 40-70, Conditional)**
- Some structure
- Moderate contrast
- 2-3 design elements

**Low Quality (Score: 0-40, Fail)**
- Mostly noise/unstructured
- Poor contrast
- Minimal design elements

**Why Synthetic Data?**
- Fast generation (no manual labeling)
- Consistent quality levels
- Easily scalable
- Good for proof-of-concept

**For Production:** Replace with real retail ad dataset (e.g., scraped ads labeled by human annotators).

---

## 📈 Expected Performance

After 20 epochs:

- **Training Loss:** ~150-250
- **Validation Loss:** ~200-300
- **MAE (Quality Score):** ~10-15 points
- **Compliance Accuracy:** ~85-95%

**Sample Predictions:**
```
True: [85.3, 1] | Pred: [82.1, 0.89]  → Grade: A, Pass
True: [45.7, 0] | Pred: [48.2, 0.32]  → Grade: D, Fail
True: [92.1, 1] | Pred: [88.5, 0.95]  → Grade: A, Pass
```

---

## 🌐 Web Integration

### Using TensorFlow.js Model

The trained model is automatically exported to TensorFlow.js format for browser use:

```javascript
// Load model in your web app
const model = await tf.loadLayersModel('../models/tfjs_model/model.json');

// Preprocess image
const img = tf.browser.fromPixels(imageElement)
  .resizeBilinear([224, 224])
  .expandDims(0)
  .toFloat();

// Predict
const predictions = model.predict(img);
const [qualityScore, complianceProb] = await predictions.data();

console.log(`Quality: ${qualityScore.toFixed(1)}/100`);
console.log(`Compliance: ${complianceProb > 0.5 ? 'Pass' : 'Fail'}`);
```

### Integration with Editor

Add this to `editor.js`:

```javascript
// Load AI model on page load
let aiModel = null;

async function loadAIModel() {
    try {
        aiModel = await tf.loadLayersModel('models/tfjs_model/model.json');
        console.log('✅ AI model loaded');
    } catch (error) {
        console.error('Failed to load AI model:', error);
    }
}

// Call when editor initializes
loadAIModel();

// Use for real-time scoring
async function analyzeAd(canvas) {
    if (!aiModel) return null;
    
    const img = tf.browser.fromPixels(canvas.lowerCanvasEl)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .toFloat();
    
    const predictions = aiModel.predict(img);
    const [quality, compliance] = await predictions.data();
    
    return {
        qualityScore: Math.round(quality),
        compliance: compliance > 0.5 ? 'Pass' : 'Fail'
    };
}
```

---

## 🔧 Troubleshooting

### "No module named 'tensorflow'"
```bash
pip install tensorflow
```

### "Module 'tensorflowjs' has no attribute 'converters'"
```bash
pip install tensorflowjs --upgrade
```

### Training is slow
- Use GPU if available
- Reduce `epochs` to 10
- Reduce `n_samples` to 500

### Out of memory
- Reduce `batch_size` to 16
- Reduce image size to 128×128
- Reduce `n_samples`

### Model not learning (loss not decreasing)
- This is normal with synthetic data
- Loss should decrease from ~800 to ~200-300
- Focus on relative improvement, not absolute values

---

## 📚 Model Files Explained

### `ad_quality_model_latest.keras`
- Main model file (Keras SavedModel format)
- Use for Python inference
- ~10MB file size

### `tfjs_model/`
- Web-optimized format
- Load in browser with TensorFlow.js
- Multiple shard files (~12MB total)

### `model_metadata.json`
- Training configuration
- Performance metrics
- Model version info
- Input/output specifications

### `best_model.keras`
- Checkpoint of best model during training
- Based on validation loss
- Use if latest model overfits

---



### For Hackathon Submission:

1. ✅ **You now have trained model files** → Show in `models/` folder
2. ✅ **Training logs and curves** → Show in `logs/` folder
3. ✅ **Complete training pipeline** → Show code in `training/`

### For Production:

1. **Collect Real Data**
   - Scrape retail ads from web
   - Label with quality scores (crowdsourcing)
   - Aim for 10,000+ samples

2. **Improve Model**
   - Use transfer learning (ResNet, EfficientNet)
   - Add more features (text detection, color analysis)
   - Fine-tune on real data

3. **Deploy**
   - Set up REST API (Flask/FastAPI)
   - Containerize with Docker
   - Deploy to cloud (AWS/GCP/Azure)

---

## 📖 References

- **TensorFlow:** https://www.tensorflow.org/
- **Keras:** https://keras.io/
- **TensorFlow.js:** https://www.tensorflow.org/js
- **Transfer Learning:** https://www.tensorflow.org/tutorials/images/transfer_learning

---

## 👥 Team Sarthak

**Tesco Retail Media InnovAItion Jam 2025**


---

**Questions?** Check logs for errors or review model summary in console output.
