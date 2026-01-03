"""
RetailSync AI - Ad Quality & Compliance Training Pipeline
Trains CNN models for:
1. Ad Quality Score (0-100)
2. Compliance Prediction (Pass/Fail)
"""

import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from datetime import datetime
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

# Configuration
CONFIG = {
    'img_height': 224,
    'img_width': 224,
    'batch_size': 32,
    'epochs': 20,
    'learning_rate': 0.001,
    'seed': 42
}

class AdQualityTrainer:
    def __init__(self, config):
        self.config = config
        self.model = None
        self.history = None
        self.setup_directories()
        
    def setup_directories(self):
        """Create necessary directories"""
        os.makedirs('../models', exist_ok=True)
        os.makedirs('../logs', exist_ok=True)
        os.makedirs('../data/training_images', exist_ok=True)
        
    def build_quality_model(self):
        """Build CNN for Ad Quality Scoring (regression)"""
        model = keras.Sequential([
            # Input layer
            layers.Input(shape=(self.config['img_height'], self.config['img_width'], 3)),
            
            # Data augmentation
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.1),
            layers.RandomZoom(0.1),
            
            # Rescaling
            layers.Rescaling(1./255),
            
            # Convolutional blocks
            layers.Conv2D(32, 3, activation='relu', padding='same'),
            layers.MaxPooling2D(),
            layers.BatchNormalization(),
            
            layers.Conv2D(64, 3, activation='relu', padding='same'),
            layers.MaxPooling2D(),
            layers.BatchNormalization(),
            
            layers.Conv2D(128, 3, activation='relu', padding='same'),
            layers.MaxPooling2D(),
            layers.BatchNormalization(),
            
            layers.Conv2D(256, 3, activation='relu', padding='same'),
            layers.GlobalAveragePooling2D(),
            
            # Dense layers
            layers.Dropout(0.4),
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.2),
            
            # Output: Quality score (0-100) and Compliance (0-1)
            layers.Dense(2, activation='linear', name='outputs')
        ])
        
        return model
    
    def compile_model(self, model):
        """Compile model with custom loss"""
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=self.config['learning_rate']),
            loss='mse',
            metrics=['mae', 'mse']
        )
        return model
    
    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic training data"""
        print(f"Generating {n_samples} synthetic training samples...")
        
        X = []
        y_quality = []
        y_compliance = []
        
        for i in range(n_samples):
            # Generate random image
            img = np.random.randint(0, 255, 
                (self.config['img_height'], self.config['img_width'], 3), 
                dtype=np.uint8)
            
            # Add some patterns to simulate ad features
            # High quality ads: more structured patterns
            quality_level = np.random.rand()
            
            if quality_level > 0.7:  # High quality
                # Add structured rectangles (simulating text/images)
                for _ in range(3):
                    x, y = np.random.randint(0, 150, 2)
                    w, h = np.random.randint(20, 50, 2)
                    color = np.random.randint(100, 255, 3)
                    img[y:y+h, x:x+w] = color
                quality_score = np.random.uniform(70, 100)
                compliance = 1 if quality_score > 75 else 0
                
            elif quality_level > 0.4:  # Medium quality
                # Add some patterns
                for _ in range(2):
                    x, y = np.random.randint(0, 180, 2)
                    w, h = np.random.randint(10, 30, 2)
                    color = np.random.randint(50, 200, 3)
                    img[y:y+h, x:x+w] = color
                quality_score = np.random.uniform(40, 70)
                compliance = 1 if quality_score > 60 else 0
                
            else:  # Low quality
                # Mostly noise
                quality_score = np.random.uniform(0, 40)
                compliance = 0
            
            X.append(img)
            y_quality.append(quality_score)
            y_compliance.append(compliance)
        
        X = np.array(X, dtype=np.uint8)
        y = np.column_stack([y_quality, y_compliance])
        
        return X, y
    
    def train(self, X_train, y_train, X_val, y_val):
        """Train the model"""
        print("\n" + "="*50)
        print("Starting Training...")
        print("="*50)
        
        # Build and compile model
        self.model = self.build_quality_model()
        self.model = self.compile_model(self.model)
        
        # Print model summary
        self.model.summary()
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=1e-7
            ),
            keras.callbacks.ModelCheckpoint(
                '../models/best_model.keras',
                monitor='val_loss',
                save_best_only=True
            )
        ]
        
        # Train
        self.history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=self.config['epochs'],
            batch_size=self.config['batch_size'],
            callbacks=callbacks,
            verbose=1
        )
        
        return self.history
    
    def evaluate(self, X_test, y_test):
        """Evaluate model on test set"""
        print("\n" + "="*50)
        print("Evaluating Model...")
        print("="*50)
        
        results = self.model.evaluate(X_test, y_test, verbose=1)
        
        print(f"\nTest Loss: {results[0]:.4f}")
        print(f"Test MAE: {results[1]:.4f}")
        print(f"Test MSE: {results[2]:.4f}")
        
        # Sample predictions
        predictions = self.model.predict(X_test[:10])
        print("\nSample Predictions (Quality Score, Compliance):")
        for i in range(10):
            print(f"True: [{y_test[i][0]:.1f}, {y_test[i][1]:.0f}] | "
                  f"Pred: [{predictions[i][0]:.1f}, {predictions[i][1]:.2f}]")
        
        return results
    
    def save_model(self):
        """Save trained model and metadata"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save model in multiple formats
        self.model.save(f'../models/ad_quality_model_{timestamp}.keras')
        self.model.save(f'../models/ad_quality_model_latest.keras')
        
        # Save as TensorFlow.js format for web integration
        import tensorflowjs as tfjs
        tfjs.converters.save_keras_model(
            self.model, 
            '../models/tfjs_model'
        )
        
        # Save metadata
        metadata = {
            'timestamp': timestamp,
            'config': self.config,
            'architecture': 'CNN',
            'input_shape': [self.config['img_height'], self.config['img_width'], 3],
            'outputs': {
                'quality_score': 'float (0-100)',
                'compliance': 'float (0-1, threshold at 0.5)'
            },
            'performance': {
                'final_loss': float(self.history.history['loss'][-1]),
                'final_val_loss': float(self.history.history['val_loss'][-1]),
                'best_val_loss': float(min(self.history.history['val_loss']))
            }
        }
        
        with open('../models/model_metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n✅ Model saved successfully!")
        print(f"   - Keras model: models/ad_quality_model_latest.keras")
        print(f"   - TensorFlow.js: models/tfjs_model/")
        print(f"   - Metadata: models/model_metadata.json")
    
    def plot_training_history(self):
        """Plot training curves"""
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        
        # Loss plot
        axes[0].plot(self.history.history['loss'], label='Train Loss')
        axes[0].plot(self.history.history['val_loss'], label='Val Loss')
        axes[0].set_xlabel('Epoch')
        axes[0].set_ylabel('Loss')
        axes[0].set_title('Model Loss')
        axes[0].legend()
        axes[0].grid(True, alpha=0.3)
        
        # MAE plot
        axes[1].plot(self.history.history['mae'], label='Train MAE')
        axes[1].plot(self.history.history['val_mae'], label='Val MAE')
        axes[1].set_xlabel('Epoch')
        axes[1].set_ylabel('MAE')
        axes[1].set_title('Mean Absolute Error')
        axes[1].legend()
        axes[1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('../logs/training_curves.png', dpi=150, bbox_inches='tight')
        print(f"📊 Training curves saved to: logs/training_curves.png")
        
    def save_training_log(self):
        """Save detailed training log"""
        log = {
            'timestamp': datetime.now().isoformat(),
            'config': self.config,
            'history': {
                'loss': [float(x) for x in self.history.history['loss']],
                'val_loss': [float(x) for x in self.history.history['val_loss']],
                'mae': [float(x) for x in self.history.history['mae']],
                'val_mae': [float(x) for x in self.history.history['val_mae']],
            },
            'epochs_trained': len(self.history.history['loss'])
        }
        
        with open('../logs/training_log.json', 'w') as f:
            json.dump(log, f, indent=2)
        
        print(f"📝 Training log saved to: logs/training_log.json")

def main():
    print("="*60)
    print("RetailSync AI - Ad Quality & Compliance Model Training")
    print("="*60)
    
    # Initialize trainer
    trainer = AdQualityTrainer(CONFIG)
    
    # Generate synthetic data
    print("\n📊 Generating training data...")
    X, y = trainer.generate_synthetic_data(n_samples=1000)
    
    # Split data
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=CONFIG['seed']
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=CONFIG['seed']
    )
    
    print(f"\n📦 Dataset Split:")
    print(f"   Training: {len(X_train)} samples")
    print(f"   Validation: {len(X_val)} samples")
    print(f"   Test: {len(X_test)} samples")
    
    # Train model
    trainer.train(X_train, y_train, X_val, y_val)
    
    # Evaluate
    trainer.evaluate(X_test, y_test)
    
    # Save everything
    trainer.save_model()
    trainer.plot_training_history()
    trainer.save_training_log()
    
    print("\n" + "="*60)
    print("✅ Training Complete!")
    print("="*60)
    print("\nNext steps:")
    print("1. Check models/ folder for trained model files")
    print("2. Check logs/ folder for training curves and logs")
    print("3. Integrate model into your web editor using TensorFlow.js")

if __name__ == "__main__":
    main()
