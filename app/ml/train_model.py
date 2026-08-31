import os
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib


DATASET_PATH = "app/ml/commits_dataset.csv"
MODEL_PATH = "app/ml/bug_model.pkl"


def train_model():

    print("======================================")
    print(" AI CODE INTELLIGENCE")
    print(" Bug Prediction Model Training")
    print("======================================")
    print()

    # ----------------------------------
    # Check dataset
    # ----------------------------------

    if not os.path.exists(DATASET_PATH):

        print("ERROR: Dataset not found.")
        print()
        print("Expected:")
        print(DATASET_PATH)

        return

    print("Loading dataset...")
    print()

    df = pd.read_csv(DATASET_PATH)

    print("Dataset shape:", df.shape)
    print()

    print("Columns:")
    print(df.columns.tolist())
    print()

    print("Bug-fix distribution:")
    print(df["bug_fix"].value_counts())
    print()

    # ----------------------------------
    # Check classes
    # ----------------------------------

    classes = df["bug_fix"].nunique()

    if classes < 2:

        print("======================================")
        print("TRAINING STOPPED")
        print("======================================")
        print()

        print(
            "The dataset contains only one class."
        )

        print()

        print(
            "Current bug_fix values:"
        )

        print(
            df["bug_fix"].value_counts()
        )

        print()

        print(
            "A supervised ML model needs at least:"
        )

        print("0 = normal commit")
        print("1 = bug-fix commit")

        print()

        print(
            "Your repository currently has too few"
        )

        print(
            "commits to train a bug prediction model."
        )

        print()

        return

    # ----------------------------------
    # Features
    # ----------------------------------

    feature_columns = [
        "files_changed"
    ]

    # Add available numerical features
    possible_features = [
        "files_changed",
        "additions",
        "deletions",
        "total_changes"
    ]

    feature_columns = [
        column
        for column in possible_features
        if column in df.columns
    ]

    print("Features used:")
    print(feature_columns)
    print()

    X = df[feature_columns]

    y = df["bug_fix"]

    # ----------------------------------
    # Train/test split
    # ----------------------------------

    print("Preparing training data...")

    try:

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42,
            stratify=y
        )

    except ValueError:

        print()
        print(
            "Dataset is too small for a stratified"
        )
        print(
            "train/test split."
        )

        print()

        print(
            "Collect more commits before training."
        )

        return

    # ----------------------------------
    # Model
    # ----------------------------------

    print()
    print("Training Random Forest model...")

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(
        X_train,
        y_train
    )

    # ----------------------------------
    # Prediction
    # ----------------------------------

    predictions = model.predict(
        X_test
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print()
    print("======================================")
    print(" MODEL RESULTS")
    print("======================================")

    print()

    print(
        f"Accuracy: {accuracy:.2f}"
    )

    print()

    print("Classification Report:")

    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0
        )
    )

    # ----------------------------------
    # Save model
    # ----------------------------------

    joblib.dump(
        model,
        MODEL_PATH
    )

    print()
    print("======================================")
    print(" MODEL SAVED")
    print("======================================")

    print()

    print(
        "Model:",
        MODEL_PATH
    )

    print()

    print("Training completed successfully.")


if __name__ == "__main__":
    train_model()