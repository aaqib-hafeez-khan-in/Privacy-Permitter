# Privacy Permitter

Chrome extension that reviews installed extensions and scores their requested permissions for quick risk visibility.

## What it does

- Lists enabled installed extensions.
- Scores sensitive permissions and broad host access.
- Groups results into **Critical**, **Warning**, and **Safe**.
- Supports search and category filters.

The scoring model is a heuristic and is intended for awareness, not a definitive security verdict.

## Permission

- `management` — required to enumerate installed extensions and inspect their declared permissions.

## Install locally

1. Open `chrome://extensions/` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the repository folder.

## Structure

```text
Privacy-Permitter/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── README.md
```

## Risk thresholds

- **Critical:** 50+
- **Warning:** 20–49
- **Safe:** below 20

Future production hardening and Chrome Web Store work is tracked in [#1](../../issues/1).
