@echo off
REM RetailSync AI - Training Pipeline Launcher
REM Windows Batch Script

echo ========================================
echo RetailSync AI - Training Pipeline
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

echo [1/4] Checking Python installation...
python --version
echo.

REM Check if in training directory
if not exist "train_ad_quality_model.py" (
    echo ERROR: Please run this script from the training/ directory
    pause
    exit /b 1
)

echo [2/4] Installing dependencies...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo WARNING: Some packages might have failed to install
    echo Attempting to continue...
)
echo.

echo [3/4] Starting model training...
echo This will take 5-10 minutes...
echo.
python train_ad_quality_model.py
if errorlevel 1 (
    echo.
    echo ERROR: Training failed. Check error messages above.
    pause
    exit /b 1
)
echo.

echo [4/4] Running inference test...
python inference.py
echo.

echo ========================================
echo Training Complete!
echo ========================================
echo.
echo Check the following folders:
echo   - models/  (trained model files)
echo   - logs/    (training curves and logs)
echo   - data/    (generated dataset)
echo.
echo Next: Integrate the model into your web editor
echo See training/README.md for integration guide
echo.

pause
