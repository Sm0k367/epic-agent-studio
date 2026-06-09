# Mouse stress test — SOTA on Windows

Script: `epic-os-platform/scripts/human-stress-test.py`

## When to use

User wants live site tested **on their screen** with **real mouse movement** — not headless Playwright sandbox.

## Dependencies

```bash
pip install pyautogui pygetwindow
```

## Run

```powershell
cd "C:\Users\Epic Tech\epic-os-platform"
$env:MANUAL_LOGIN_SEC="150"   # seconds to complete Google sign-in manually
python scripts/human-stress-test.py
```

## What it does

1. Launches Edge `--start-maximized` to production URL
2. `pygetwindow` focuses browser by title
3. `pyautogui` moves cursor in curved paths before each click
4. Navigates via Ctrl+L + type URL (human-like)
5. Stresses all public routes, homepage CTAs, pricing, footer
6. Clicks Google sign-in → pauses for manual OAuth
7. If signed in: OS search, sidebar categories, app tiles, dock, settings, billing
8. Redirect regression loop test

## Safety

| Control | Action |
|---------|--------|
| FAILSAFE | Move mouse to **top-left corner** → script aborts |
| User says stop | `Stop-Process` on python PID |
| Don't run | Without explicit user request for mouse takeover |

## Lenovo / multi-monitor

- Uses **relative** click positions (`rel_x`, `rel_y` as fraction of window)
- Window must be focused — script calls `focus_edge()` before clicks
- If scaling breaks clicks: maximize Edge, 100% display scale, or adjust fractions

## Alternative: Playwright headed

`scripts/stress-test-live.mjs` — Chromium on screen, no physical mouse. Use when user doesn't want cursor hijack.

```bash
$env:MANUAL_LOGIN_SEC="120"; $env:SLOW_MO="400"; node scripts/stress-test-live.mjs
```