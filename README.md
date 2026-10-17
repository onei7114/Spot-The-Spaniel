# Spot The Spaniel

Spot The Spaniel is a local web application that compares one uploaded JPG/JPEG photo with a browser-loaded Teachable Machine spaniel model and displays the highest-scoring spaniel prediction plus one representative photo from the matching breed gallery. The model includes a `Not A Dog` class.

## Requirements

- Python 3.11
- Network access to load the TensorFlow.js and Teachable Machine libraries and the published spaniel model

## Install

```powershell
py -3.11 -m venv .venv311
.\.venv311\Scripts\python.exe -m pip install -e ".[dev,model]"
```
Predictions run in the browser. The published Teachable Machine models are external model assets; uploaded photos are sent to those models only through browser inference and are not uploaded to this app's server.

## Optional legacy reference index

The original local CLIP reference index remains available for development and evaluation, but the browser application no longer calls it for matches.

```powershell
.\.venv311\Scripts\python.exe -m dog_match validate-dataset --dataset .\Dog-Breeds-Dataset
.\.venv311\Scripts\python.exe -m dog_match build-index --dataset .\Dog-Breeds-Dataset --cache-dir .\.cache\dog-match
```

The dataset is treated as read-only. Breed names come only from image parent-folder titles. The generated vector index is rebuildable and stored outside the dataset; it does not copy image files.

## Start the App

```powershell
.\.venv311\Scripts\python.exe -m dog_match serve --dataset .\Dog-Breeds-Dataset --cache-dir .\.cache\dog-match --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/`. The page loads TensorFlow.js and the spaniel Teachable Machine model in the browser.

## Publish a Free Shareable Link

The repository includes a GitHub Pages workflow for the browser-only app. After pushing the project to GitHub:

1. Open the repository's **Settings > Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or run **Deploy Spot The Spaniel** from the Actions tab.

The public link will be:

`https://onei7114.github.io/Dog-Match-Final-Project/`

The workflow publishes only the static app and representative gallery. The local training dataset is excluded from Git with `.gitignore`.

## Deploy on Render

The repository also includes `render.yaml` for a public Render web service. In Render, choose **New > Blueprint**, connect this GitHub repository, and select the `main` branch. Render will detect the blueprint and use the included build and start commands.

Render provides a public URL such as:

`https://spot-the-spaniel.onrender.com`

The free service may sleep after inactivity, so the first request after a period of inactivity can take longer. Predictions still run in each visitor's browser; the service only delivers the app files.

## Privacy and Upload Safety

Uploaded photos are validated as readable JPEG content and processed locally in the browser. The application does not create user accounts, store personal details, save uploaded photos, retain match history, or log raw filenames/image contents. The uploaded photo is not sent to this app's server.

## Similarity and Accuracy

The displayed 1-100% number is the highest raw class probability returned by the spaniel Teachable Machine model. It is not calibrated breed confidence or a guarantee that the breed name is correct. A result is rejected when `Not A Dog` is at least as likely as the best spaniel class, or when the best spaniel prediction is below 50% or does not lead the next spaniel class by at least 10 percentage points. The displayed breed photo is representative, not the closest training image.

The static gallery contains one photo per dataset breed folder. Preserve the dataset's included README and CC BY 4.0 license when distributing the gallery.

Run the 100-photo evaluation after building the full reference index:

```powershell
.\.venv311\Scripts\python.exe scripts\evaluate_matching.py --dataset .\Dog-Breeds-Dataset --cache-dir .\.cache\dog-match --sample-size 100 --seed 42
```

The initial release gate is at least 80 correct parent-folder breed labels out of 100. Do not claim this threshold is met until the evaluation report is produced.

## Tests and Type Checking

```powershell
.\.venv311\Scripts\python.exe -m pytest --cov=dog_match --cov-report=term-missing --cov-fail-under=80.1
.\.venv311\Scripts\python.exe -m mypy src\dog_match
```

Coverage must be strictly greater than 80%. Browser-flow tests use Playwright. WebKit provides a Safari-family check on Windows; verify actual Safari on a macOS test host for a release browser matrix.

## Dataset Attribution

The `Dog-Breeds-Dataset/` directory includes its own `README.md` and CC BY 4.0 `LICENSE`. Preserve both with the collection and retain attribution to the original dataset source as identified in its accompanying metadata. The presence of the FCI breed list does not by itself establish that FCI authored or licensed every photograph.
