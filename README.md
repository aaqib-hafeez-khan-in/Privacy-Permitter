# Privacy Permitter

## Overview

Privacy Permitter is a Chrome Extension that analyzes installed browser extensions and assigns risk scores based on their requested permissions. The extension helps users identify potentially dangerous extensions that have access to sensitive data or capabilities.

## Permissions Used

- `management`: Required to enumerate installed extensions and read their permissions

## Risk Scoring Model

Permission weights:

| Permission | Weight |
|------------|--------|
| all_urls / <all_urls> | 40 |
| browsingData | 35 |
| webRequest | 30 |
| webRequestBlocking | 30 |
| nativeMessaging | 30 |
| geolocation | 25 |
| history | 25 |
| tabs | 20 |
| cookies | 20 |
| clipboardRead | 20 |
| downloads | 15 |
| all other permissions | 2 |

Host permissions scoring:
- `<all_urls>`, `*://*/*`, `https://*/*`, or `http://*/*` adds 40 points

Categories:
- Critical (red): score >= 50
- Warning (amber): score >= 20
- Safe (green): score < 20

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the Privacy-Permitter directory
5. The extension icon will appear in your toolbar

## File Structure

```
Privacy-Permitter/
├── manifest.json
├── background/
│   └── service-worker.js
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── README.md
```
