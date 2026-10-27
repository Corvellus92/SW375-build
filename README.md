# 3.75 Collection

Star Wars 3.75-inch collector catalog, Android app and desktop web app.

## PC / desktop website

The latest desktop site is in [web/](./web/) (v1.18, 1,257 catalog entries).
Download the **375-Collection-PC-Web** artifact from [GitHub Actions](./actions/workflows/web.yml), extract the ZIP, then open `index.html` in a browser. For best results, serve the directory through a local HTTP server (for example `python -m http.server 8000` and visit `http://localhost:8000`).

Features: responsive desktop grid, dashboard, global search, collection editor, JSON backup, CSV export, HU/EN/DE languages, optional PC-phone sync.

**Important:** This repository is private and GitHub Pages is not enabled. To publish the website online, enable GitHub Pages under Settings > Pages (or use a public repository if your GitHub plan does not support private-repository Pages). Select branch `main` and folder `/web` is **not** an option in GitHub Pages branch publishing; use a `/docs` folder, `gh-pages` branch, or a GitHub Actions Pages workflow. Do not assume a public Pages URL exists yet.

Personal collection data is stored locally in the browser; back it up using JSON export. Different browsers or devices do not automatically share local storage.

## Android

The latest APK can be downloaded from [Android GitHub Actions](./actions/workflows/android.yml).
