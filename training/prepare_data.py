"""
Data Preparation Script for RetailSync AI
Downloads and prepares sample retail ad images for training
"""

import os
import requests
from PIL import Image
import numpy as np
from io import BytesIO

def download_sample_images():
    """Download sample retail images from free sources"""
    
    # Create directories
    os.makedirs('../data/training_images/high_quality', exist_ok=True)
    os.makedirs('../data/training_images/medium_quality', exist_ok=True)
    os.makedirs('../data/training_images/low_quality', exist_ok=True)
    
    print("📥 Downloading sample retail ad images...")
    
    # Sample image URLs (using Unsplash placeholder service)
    # In real scenario, use actual retail ad dataset
    categories = {
        'high_quality': [
            'https://source.unsplash.com/random/400x400/?product,advertisement',
            'https://source.unsplash.com/random/400x400/?retail,banner',
            'https://source.unsplash.com/random/400x400/?shopping,poster',
        ],
        'medium_quality': [
            'https://source.unsplash.com/random/400x400/?sale,flyer',
            'https://source.unsplash.com/random/400x400/?discount,ad',
        ],
        'low_quality': [
            'https://source.unsplash.com/random/400x400/?store,sign',
        ]
    }
    
    for quality, urls in categories.items():
        print(f"\nDownloading {quality} images...")
        for idx, url in enumerate(urls):
            try:
                response = requests.get(url, timeout=10)
                img = Image.open(BytesIO(response.content))
                img = img.resize((400, 400))
                img.save(f'../data/training_images/{quality}/img_{idx}.jpg')
                print(f"  ✓ Saved {quality}/img_{idx}.jpg")
            except Exception as e:
                print(f"  ✗ Failed to download {url}: {e}")
    
    print("\n✅ Sample images downloaded!")

def create_synthetic_dataset(n_samples=200):
    """Create synthetic ad images with different quality levels"""
    
    print(f"\n🎨 Creating {n_samples} synthetic ad images...")
    
    os.makedirs('../data/synthetic_ads', exist_ok=True)
    
    for i in range(n_samples):
        # Determine quality level
        quality_rand = np.random.rand()
        
        if quality_rand > 0.6:
            quality = 'high'
            base_color = np.random.randint(200, 255, 3)
        elif quality_rand > 0.3:
            quality = 'medium'
            base_color = np.random.randint(100, 200, 3)
        else:
            quality = 'low'
            base_color = np.random.randint(0, 100, 3)
        
        # Create image
        img = np.ones((400, 400, 3), dtype=np.uint8) * base_color
        
        # Add patterns based on quality
        if quality == 'high':
            # Add structured elements (simulating good ad design)
            for _ in range(5):
                x, y = np.random.randint(0, 300, 2)
                w, h = np.random.randint(50, 100, 2)
                color = np.random.randint(150, 255, 3)
                img[y:y+h, x:x+w] = color
        
        elif quality == 'medium':
            # Add some elements
            for _ in range(3):
                x, y = np.random.randint(0, 350, 2)
                w, h = np.random.randint(30, 60, 2)
                color = np.random.randint(80, 200, 3)
                img[y:y+h, x:x+w] = color
        
        # Save image
        pil_img = Image.fromarray(img)
        pil_img.save(f'../data/synthetic_ads/{quality}_{i:04d}.jpg')
        
        if (i + 1) % 50 == 0:
            print(f"  Created {i + 1}/{n_samples} images...")
    
    print(f"✅ Synthetic dataset created in data/synthetic_ads/")

def create_metadata():
    """Create dataset metadata"""
    
    import json
    
    metadata = {
        "dataset_name": "RetailSync Ad Quality Dataset",
        "version": "1.0",
        "description": "Synthetic dataset for training ad quality and compliance models",
        "categories": {
            "high_quality": {
                "score_range": "70-100",
                "compliance": "Pass",
                "characteristics": "Clear structure, good contrast, professional design"
            },
            "medium_quality": {
                "score_range": "40-70",
                "compliance": "Conditional",
                "characteristics": "Adequate design, some issues"
            },
            "low_quality": {
                "score_range": "0-40",
                "compliance": "Fail",
                "characteristics": "Poor design, low contrast, unclear"
            }
        },
        "total_samples": 200,
        "image_format": "JPG",
        "image_size": "400x400"
    }
    
    with open('../data/dataset_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("📝 Dataset metadata created")

if __name__ == "__main__":
    print("="*60)
    print("RetailSync AI - Data Preparation")
    print("="*60)
    
    # Option 1: Create synthetic dataset (fast, no internet needed)
    create_synthetic_dataset(n_samples=200)
    
    # Option 2: Download sample images (requires internet)
    # Uncomment to use:
    # try:
    #     download_sample_images()
    # except Exception as e:
    #     print(f"⚠️  Download failed: {e}")
    #     print("Using synthetic data only")
    
    create_metadata()
    
    print("\n" + "="*60)
    print("✅ Data preparation complete!")
    print("="*60)
    print("\nYou can now run: python train_ad_quality_model.py")
