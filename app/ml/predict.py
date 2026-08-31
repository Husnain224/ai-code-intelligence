import sys
import json
import joblib
import pandas as pd
from pathlib import Path


def main():
    if len(sys.argv) != 5:
        print(
            json.dumps({
                "success": False,
                "error": "Expected 4 arguments"
            })
        )
        sys.exit(1)

    try:
        files_changed = float(sys.argv[1])
        additions = float(sys.argv[2])
        deletions = float(sys.argv[3])
        total_changes = float(sys.argv[4])
    except ValueError:
        print(
            json.dumps({
                "success": False,
                "error": "All values must be numbers"
            })
        )
        sys.exit(1)

    model_path = (
        Path(__file__).resolve().parent / "bug_model.pkl"
    )

    if not model_path.exists():
        print(
            json.dumps({
                "success": False,
                "error": "Model file not found",
                "modelPath": str(model_path)
            })
        )
        sys.exit(1)

    try:
        model = joblib.load(model_path)

        features = pd.DataFrame(
            [
                {
                    "files_changed": files_changed,
                    "additions": additions,
                    "deletions": deletions,
                    "total_changes": total_changes,
                }
            ]
        )

        prediction = int(model.predict(features)[0])

        probabilities = model.predict_proba(features)[0]

        bug_probability = float(probabilities[1])

        bug_risk = round(bug_probability * 100, 2)

        if bug_risk >= 70:
            label = "High Bug Risk"
        elif bug_risk >= 40:
            label = "Medium Bug Risk"
        else:
            label = "Low Bug Risk"

        result = {
            "success": True,
            "prediction": prediction,
            "bugRisk": bug_risk,
            "label": label,
            "features": {
                "filesChanged": files_changed,
                "additions": additions,
                "deletions": deletions,
                "totalChanges": total_changes,
            },
        }

        print(json.dumps(result))

    except Exception as error:
        print(
            json.dumps({
                "success": False,
                "error": str(error)
            })
        )
        sys.exit(1)


if __name__ == "__main__":
    main()