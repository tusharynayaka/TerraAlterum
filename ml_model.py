import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
import os

class RainfallPredictor:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'rainfall_model.pkl')
        self.model = self._load_or_train_model()

    def _load_or_train_model(self):
        """Loads a pre-trained model or trains a simple one for demo."""
        if os.path.exists(self.model_path):
            try:
                return joblib.load(self.model_path)
            except:
                pass
        
        # Simple demo model: Predict rainfall based on humidity, temp, and pressure
        # X = [[humidity, temp, pressure]], y = rainfall_risk (0-100)
        X = np.array([
            [40, 30, 1010], [50, 28, 1008], [60, 25, 1005], 
            [70, 22, 1002], [80, 20, 1000], [90, 18, 998]
        ])
        y = np.array([5, 15, 30, 50, 75, 95])
        
        model = LinearRegression()
        model.fit(X, y)
        joblib.dump(model, self.model_path)
        return model

    def predict(self, humidity=75, temp=23, pressure=1000):
        """Predicts rainfall risk percentage."""
        features = np.array([[humidity, temp, pressure]])
        prediction = self.model.predict(features)
        return float(max(0, min(100, prediction[0])))

rainfall_predictor = RainfallPredictor()
