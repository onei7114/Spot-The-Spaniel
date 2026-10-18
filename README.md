# Spot The Spaniel

Spot The Spaniel is a browser-based spaniel breed matching app. A visitor uploads a JPG or
JPEG dog photo, and the app uses a Teachable Machine model to return the most confident
spaniel prediction and a representative breed photo.

Try the live site:

<https://onei7114.github.io/Spot-The-Spaniel/>

## How the app works

1. The visitor selects a JPG or JPEG photo.
2. The photo is processed in the browser with the published spaniel model.
3. The app rejects the photo if the model selects `Not A Dog`.
4. The app accepts a result only when the top spaniel prediction is at least 50% and leads
   the next class by at least 10 percentage points.
5. The app displays the highest-confidence spaniel, or all breeds tied for first place.
6. A representative photo is loaded from the static gallery.

The confidence value is a model estimate, not a guaranteed breed identification. The
uploaded photo is not sent to or stored by the application server.

## Run the site locally

The current browser app does not require the original dog database or CLIP model. To run the
same static site locally on Windows:

### 1. Clone the repository

```powershell
git clone https://github.com/onei7114/Spot-The-Spaniel.git
cd Spot-The-Spaniel
```

### 2. Build the static site

Python 3.11 or newer is recommended.

```powershell
py -3.11 scripts\build-pages.py
```

This copies the browser app and gallery into the generated `dist\` directory and adjusts
paths for GitHub Pages or another static host.

### 3. Start a local web server

```powershell
py -3.11 -m http.server 8000 --directory dist
```

Open <http://127.0.0.1:8000/> in a browser.

Do not open `index.html` directly with a `file://` URL. A local web server is required so
the gallery manifest and images load correctly.

Press `Ctrl+C` in the terminal to stop the server.

## Requirements

- Python 3.11 or newer
- A modern browser with JavaScript enabled
- Internet access to load TensorFlow.js, the Teachable Machine model, and the model gallery

Supported browsers include current Chrome, Edge, and Firefox releases.

## Repository structure

```text
src/dog_match/static/
  index.html              Browser page
  app.js                  Model loading, prediction, filtering, and gallery lookup
  styles.css              Page styling
  gallery-manifest.json   Breed-to-photo mapping
  gallery/                Representative breed photos

scripts/build-pages.py    Builds the static deployment directory
tests/                    Unit, integration, and browser-flow tests
.github/workflows/        GitHub Pages deployment workflow
render.yaml               Render deployment configuration
```

## Publish with GitHub Pages

The repository includes a workflow at
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

1. Push the repository to GitHub.
2. Open **Settings > Pages**.
3. Set the source to **GitHub Actions**.
4. Push to the `main` branch, or run **Deploy Spot The Spaniel** from the Actions tab.

The current public URL is:

<https://onei7114.github.io/Spot-The-Spaniel/>

The workflow builds and publishes only the static app and representative gallery. The
original training dataset is not needed for GitHub Pages.

The app includes a Content Security Policy that limits scripts, model requests, images, and
workers to the sources required by the browser-based model. GitHub Pages receives the policy
through the page metadata; FastAPI also sends it as an HTTP response header when serving the
app locally or through a server deployment.

## Deploy with Render

The repository also contains [`render.yaml`](render.yaml). In Render:

1. Choose **New > Blueprint**.
2. Connect the GitHub repository.
3. Select the `main` branch.
4. Apply the detected `render.yaml` configuration.

Render will provide a public `onrender.com` URL. The free service may sleep after inactivity,
so the first visit can take longer. The service only delivers the app files; prediction still
runs in each visitor's browser.

## Testing and development

Create a virtual environment and install the development dependencies:

```powershell
py -3.11 -m venv .venv311
.\.venv311\Scripts\python.exe -m pip install -e ".[dev]"
```

Run the focused test suite:

```powershell
.\.venv311\Scripts\python.exe -m pytest tests\unit tests\integration tests\e2e\test_match_flow.py -q
```

Run all tests with coverage:

```powershell
.\.venv311\Scripts\python.exe -m pytest --cov=dog_match --cov-report=term-missing
```

Run Python type checking:

```powershell
.\.venv311\Scripts\python.exe -m mypy src\dog_match
```

Browser-flow tests use Playwright. Install the required browser once if needed:

```powershell
.\.venv311\Scripts\python.exe -m playwright install
```

## Legacy local matcher

The repository still contains the earlier FastAPI/CLIP matcher and its development tools.
Those files are retained for historical tests and evaluation, but they are not required by
the active Spot The Spaniel browser flow or its public deployments.

The legacy matcher requires the separate `Dog-Breeds-Dataset`, a generated CLIP index, and
the optional model dependencies. Do not use that workflow unless you specifically need to
evaluate or maintain the old matcher.

## Privacy and image attribution

Spot The Spaniel does not create accounts, store uploaded photos, retain match history, or
log raw image contents. The representative gallery must retain the attribution and license
information supplied with its source collection.
