#!/bin/bash
# RetailSync AI - Training Pipeline Launcher
# Linux/Mac Shell Script

echo "========================================"
echo "RetailSync AI - Training Pipeline"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from python.org"
    exit 1
fi

echo "[1/4] Checking Python installation..."
python3 --version
echo ""

# Check if in training directory
if [ ! -f "train_ad_quality_model.py" ]; then
    echo "ERROR: Please run this script from the training/ directory"
    exit 1
fi

echo "[2/4] Installing dependencies..."
pip3 install -r requirements.txt --quiet
echo ""

echo "[3/4] Starting model training..."
echo "This will take 5-10 minutes..."
echo ""
python3 train_ad_quality_model.py
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Training failed. Check error messages above."
    exit 1
fi
echo ""

echo "[4/4] Running inference test..."
python3 inference.py
echo ""

echo "========================================"
echo "Training Complete!"
echo "========================================"
echo ""
echo "Check the following folders:"
echo "  - models/  (trained model files)"
echo "  - logs/    (training curves and logs)"
echo "  - data/    (generated dataset)"
echo ""
echo "Next: Integrate the model into your web editor"
echo "See training/README.md for integration guide"
echo ""
