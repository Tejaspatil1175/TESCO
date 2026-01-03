"""
Model Inference Script
Use trained model to predict ad quality and compliance
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import json
import os

class AdQualityPredictor:
    def __init__(self, model_path='../models/ad_quality_model_latest.keras'):
        """Initialize predictor with trained model"""
        self.model_path = model_path
        self.model = None
        self.metadata = None
        self.load_model()
        
    def load_model(self):
        """Load trained model and metadata"""
        if os.path.exists(self.model_path):
            print(f"Loading model from {self.model_path}...")
            self.model = keras.models.load_model(self.model_path)
            print("✅ Model loaded successfully!")
            
            # Load metadata
            metadata_path = '../models/model_metadata.json'
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
                    print(f"✅ Metadata loaded")
        else:
            raise FileNotFoundError(f"Model not found at {self.model_path}")
    
    def preprocess_image(self, image_path):
        """Preprocess image for prediction"""
        img = Image.open(image_path)
        img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, 0)
        return img_array
    
    def predict(self, image_path):
        """Predict quality score and compliance"""
        # Preprocess
        img_array = self.preprocess_image(image_path)
        
        # Predict
        predictions = self.model.predict(img_array, verbose=0)
        
        quality_score = float(predictions[0][0])
        compliance_prob = float(predictions[0][1])
        
        # Ensure quality score is in valid range
        quality_score = max(0, min(100, quality_score))
        
        # Determine compliance (threshold at 0.5)
        compliance = "Pass" if compliance_prob > 0.5 else "Fail"
        
        result = {
            'quality_score': round(quality_score, 2),
            'compliance': compliance,
            'compliance_probability': round(compliance_prob, 4),
            'grade': self._get_grade(quality_score)
        }
        
        return result
    
    def _get_grade(self, score):
        """Convert score to letter grade"""
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        elif score >= 50:
            return 'D'
        else:
            return 'F'
    
    def batch_predict(self, image_paths):
        """Predict for multiple images"""
        results = []
        for path in image_paths:
            try:
                result = self.predict(path)
                result['image_path'] = path
                results.append(result)
            except Exception as e:
                results.append({
                    'image_path': path,
                    'error': str(e)
                })
        return results

def demo_inference():
    """Demo inference on sample images"""
    
    print("="*60)
    print("RetailSync AI - Model Inference Demo")
    print("="*60)
    
    # Initialize predictor
    predictor = AdQualityPredictor()
    
    # Check if test images exist
    test_images_dir = '../assets'
    if not os.path.exists(test_images_dir):
        print(f"\n⚠️  No test images found in {test_images_dir}")
        print("Creating synthetic test image...")
        
        # Create a synthetic test image
        test_img = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
        test_img_path = 'test_ad.jpg'
        Image.fromarray(test_img).save(test_img_path)
        test_images = [test_img_path]
    else:
        # Use existing images
        test_images = [
            os.path.join(test_images_dir, f) 
            for f in os.listdir(test_images_dir) 
            if f.endswith(('.png', '.jpg', '.jpeg'))
        ][:3]  # Test on first 3 images
    
    if not test_images:
        print("No images available for testing")
        return
    
    print(f"\n🔍 Testing on {len(test_images)} images...\n")
    
    # Predict
    results = predictor.batch_predict(test_images)
    
    # Display results
    print("Results:")
    print("-" * 60)
    for result in results:
        if 'error' not in result:
            print(f"\n📄 Image: {os.path.basename(result['image_path'])}")
            print(f"   Quality Score: {result['quality_score']}/100 (Grade: {result['grade']})")
            print(f"   Compliance: {result['compliance']} ({result['compliance_probability']:.2%})")
        else:
            print(f"\n❌ Error processing {result['image_path']}: {result['error']}")
    
    print("\n" + "="*60)
    print("✅ Inference complete!")
    print("="*60)

if __name__ == "__main__":
    demo_inference()
