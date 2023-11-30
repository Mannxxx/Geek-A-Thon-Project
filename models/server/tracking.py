import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

from urllib.parse import urlparse
import mlflow
from mlflow.models import infer_signature
import mlflow.sklearn