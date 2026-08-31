import os
import time
from pathlib import Path

import requests
import pandas as pd
from dotenv import load_dotenv


# ============================================================
# CONFIGURATION
# ============================================================

load_dotenv()

OWNER = "psf"
REPO = "requests"

MAX_COMMITS = 500

OUTPUT_FILE = (
    Path(__file__).resolve().parent / "commits_dataset.csv"
)

GITHUB_API = "https://api.github.com"

TOKEN = os.getenv("GITHUB_TOKEN")


# ============================================================
# GITHUB HEADERS
# ============================================================

def get_headers():

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"

    return headers


# ============================================================
# RATE LIMIT
# ============================================================

def check_rate_limit():

    response = requests.get(
        f"{GITHUB_API}/rate_limit",
        headers=get_headers(),
        timeout=20,
    )

    if response.status_code != 200:

        print("Could not check GitHub rate limit.")
        return None

    data = response.json()

    core = data.get("resources", {}).get("core", {})

    limit = core.get("limit", 0)
    remaining = core.get("remaining", 0)
    reset = core.get("reset", 0)

    print()
    print("=" * 50)
    print("GitHub API Rate Limit")
    print("=" * 50)

    print("Limit:", limit)
    print("Remaining:", remaining)
    print("Reset timestamp:", reset)

    print("=" * 50)
    print()

    return remaining


# ============================================================
# GET COMMITS
# ============================================================

def get_commits(page):

    url = (
        f"{GITHUB_API}/repos/"
        f"{OWNER}/{REPO}/commits"
    )

    params = {
        "page": page,
        "per_page": 100,
    }

    response = requests.get(
        url,
        headers=get_headers(),
        params=params,
        timeout=30,
    )

    if response.status_code == 200:

        return response.json()

    print()
    print("GitHub API error:", response.status_code)
    print(response.text)
    print()

    return None


# ============================================================
# GET COMMIT DETAILS
# ============================================================

def get_commit_details(sha):

    url = (
        f"{GITHUB_API}/repos/"
        f"{OWNER}/{REPO}/commits/{sha}"
    )

    response = requests.get(
        url,
        headers=get_headers(),
        timeout=30,
    )

    if response.status_code == 200:

        return response.json()

    if response.status_code == 403:

        print("Rate limit reached while getting commit details.")

    else:

        print(
            f"Could not retrieve commit "
            f"{sha[:8]}: {response.status_code}"
        )

    return None


# ============================================================
# BUG-FIX DETECTION
# ============================================================

def detect_bug_fix(message):

    message = message.lower()

    bug_keywords = [
        "fix",
        "fixed",
        "fixes",
        "bug",
        "bugfix",
        "bug fix",
        "patch",
        "hotfix",
        "error",
        "issue",
        "crash",
        "failure",
        "regression",
        "broken",
        "repair",
        "correct",
        "resolve",
        "resolved",
        "security fix",
    ]

    for keyword in bug_keywords:

        if keyword in message:
            return 1

    return 0


# ============================================================
# FEATURE EXTRACTION
# ============================================================

def calculate_commit_features(commit):

    stats = commit.get("stats", {})

    files = commit.get("files", [])

    commit_info = commit.get("commit", {})

    author_info = commit_info.get(
        "author",
        {}
    )

    message = commit_info.get(
        "message",
        ""
    )

    additions = stats.get(
        "additions",
        0
    )

    deletions = stats.get(
        "deletions",
        0
    )

    total_changes = stats.get(
        "total",
        0
    )

    files_changed = len(files)

    bug_fix = detect_bug_fix(message)

    return {

        "sha": commit.get(
            "sha",
            ""
        ),

        "message": message.split(
            "\n"
        )[0],

        "author": author_info.get(
            "name",
            ""
        ),

        "date": author_info.get(
            "date",
            ""
        ),

        "additions": additions,

        "deletions": deletions,

        "total_changes": total_changes,

        "files_changed": files_changed,

        "bug_fix": bug_fix,
    }


# ============================================================
# DATASET COLLECTION
# ============================================================

def collect_dataset():

    all_commits = []

    print()
    print("=" * 50)
    print("AI CODE INTELLIGENCE")
    print("Historical GitHub Commit Dataset")
    print("=" * 50)

    print()
    print(
        f"Repository: {OWNER}/{REPO}"
    )

    print(
        f"Target commits: {MAX_COMMITS}"
    )

    print(
        f"Output: {OUTPUT_FILE}"
    )

    print()

    if TOKEN:

        print(
            "GitHub authentication: TOKEN FOUND"
        )

    else:

        print(
            "WARNING: GITHUB_TOKEN not found."
        )

        print(
            "Only unauthenticated API limits will apply."
        )

    print()

    remaining = check_rate_limit()

    if remaining is not None and remaining < 10:

        print(
            "WARNING: GitHub API rate limit is very low."
        )

        print(
            "Stop the program and wait for the reset."
        )

        return

    # --------------------------------------------------------
    # FETCH COMMITS
    # --------------------------------------------------------

    page = 1

    while len(all_commits) < MAX_COMMITS:

        print(
            f"Fetching commits page {page}..."
        )

        commits = get_commits(page)

        if commits is None:

            print(
                "Stopping because GitHub API request failed."
            )

            break

        if len(commits) == 0:

            print(
                "No more commits found."
            )

            break

        print(
            f"Found {len(commits)} commits."
        )

        for commit in commits:

            if len(all_commits) >= MAX_COMMITS:

                break

            sha = commit.get(
                "sha"
            )

            if not sha:

                continue

            print(
                f"Processing {sha[:8]}..."
            )

            details = get_commit_details(
                sha
            )

            if details is None:

                print(
                    "Skipping commit."
                )

                continue

            features = calculate_commit_features(
                details
            )

            all_commits.append(
                features
            )

            time.sleep(
                0.15
            )

        page += 1

        print()

        # Small pause between pages
        time.sleep(0.5)

    # --------------------------------------------------------
    # CHECK RESULTS
    # --------------------------------------------------------

    print()
    print("=" * 50)
    print("COLLECTION COMPLETE")
    print("=" * 50)

    print(
        "Total commits collected:",
        len(all_commits)
    )

    if not all_commits:

        print(
            "No dataset was generated."
        )

        return

    # --------------------------------------------------------
    # CREATE DATAFRAME
    # --------------------------------------------------------

    df = pd.DataFrame(
        all_commits
    )

    # Remove duplicate commits
    df = df.drop_duplicates(
        subset=["sha"]
    )

    # --------------------------------------------------------
    # SAVE DATASET
    # --------------------------------------------------------

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    # --------------------------------------------------------
    # RESULTS
    # --------------------------------------------------------

    print()
    print(
        "Dataset saved successfully!"
    )

    print(
        "Location:",
        OUTPUT_FILE
    )

    print()

    print(
        "Dataset shape:"
    )

    print(
        df.shape
    )

    print()

    print(
        "Bug-fix distribution:"
    )

    print(
        df["bug_fix"].value_counts()
    )

    print()

    print(
        "Bug-fix percentage:"
    )

    print(
        (
            df["bug_fix"]
            .value_counts(
                normalize=True
            )
            * 100
        ).round(2)
    )

    print()

    print(
        "Dataset columns:"
    )

    print(
        list(df.columns)
    )

    print()

    print(
        "First 10 rows:"
    )

    print(
        df.head(10).to_string()
    )

    print()
    print("=" * 50)
    print("DATASET READY FOR MODEL TRAINING")
    print("=" * 50)


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    collect_dataset()