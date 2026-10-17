"""Build the browser-only app for GitHub Pages."""

from __future__ import annotations

import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "dog_match" / "static"
DESTINATION = ROOT / "dist"


def main() -> None:
    if DESTINATION.exists():
        shutil.rmtree(DESTINATION)
    shutil.copytree(SOURCE, DESTINATION)

    index = DESTINATION / "index.html"
    index_text = index.read_text(encoding="utf-8")
    index_text = index_text.replace('href="/static/styles.css"', 'href="./styles.css"')
    index_text = index_text.replace('src="/static/app.js"', 'src="./app.js"')
    index.write_text(index_text, encoding="utf-8")

    app = DESTINATION / "app.js"
    app_text = app.read_text(encoding="utf-8")
    app_text = app_text.replace(
        'fetch("/static/gallery-manifest.json")',
        'fetch("./gallery-manifest.json")',
    )
    app.write_text(app_text, encoding="utf-8")


if __name__ == "__main__":
    main()
