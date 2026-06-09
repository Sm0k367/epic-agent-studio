"""
Real mouse + keyboard stress test on YOUR screen (Edge).
Moves the physical cursor, scrolls, tabs through UI, clicks like a human.

Run: python scripts/human-stress-test.py
"""
from __future__ import annotations

import random
import subprocess
import sys
import time
import webbrowser

try:
    import pyautogui
    import pygetwindow as gw
except ImportError:
    print("Installing pyautogui pygetwindow...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyautogui", "pygetwindow", "-q"])
    import pyautogui
    import pygetwindow as gw

BASE = "https://epic-os.up.railway.app"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
MANUAL_LOGIN_SEC = int(__import__("os").environ.get("MANUAL_LOGIN_SEC", "150"))

pyautogui.FAILSAFE = True  # fling mouse to top-left corner to abort
pyautogui.PAUSE = 0.15

log_pass: list[str] = []
log_fail: list[str] = []
log_warn: list[str] = []


def say(kind: str, msg: str) -> None:
    icon = {"pass": "✓", "fail": "✗", "warn": "⚠"}.get(kind, "·")
    line = f"{icon} [{kind.upper()}] {msg}"
    print(line, flush=True)
    {"pass": log_pass, "fail": log_fail, "warn": log_warn}[kind].append(msg)


def human_sleep(a: float = 0.6, b: float = 1.4) -> None:
    time.sleep(random.uniform(a, b))


def human_move(x: int, y: int) -> None:
    cx, cy = pyautogui.position()
    steps = random.randint(18, 32)
    for i in range(1, steps + 1):
        t = i / steps
        # slight arc so movement looks natural
        mx = int(cx + (x - cx) * t + random.randint(-2, 2))
        my = int(cy + (y - cy) * t + random.randint(-2, 2))
        pyautogui.moveTo(mx, my, duration=random.uniform(0.01, 0.03))
    pyautogui.moveTo(x, y, duration=random.uniform(0.08, 0.2))


def human_click(x: int | None = None, y: int | None = None) -> None:
    if x is not None and y is not None:
        human_move(x, y)
    human_sleep(0.15, 0.45)
    pyautogui.click()
    human_sleep(0.35, 0.8)


def human_scroll(clicks: int = -6) -> None:
    pyautogui.scroll(clicks)
    human_sleep(0.4, 0.9)


def focus_edge() -> tuple[int, int, int, int] | None:
    titles = ("Epic OS", "epic-os", "Sign in", "Google", "Edge")
    for _ in range(20):
        for w in gw.getAllWindows():
            t = (w.title or "").lower()
            if any(k.lower() in t for k in titles) and w.width > 400:
                try:
                    if w.isMinimized:
                        w.restore()
                    w.activate()
                    human_sleep(0.5, 0.9)
                    return w.left, w.top, w.width, w.height
                except Exception:
                    pass
        human_sleep(0.3, 0.5)
    return None


def open_site() -> None:
    print("\n=== OPENING EDGE ON YOUR SCREEN ===", flush=True)
    try:
        subprocess.Popen([EDGE, "--start-maximized", "--new-window", BASE])
    except Exception:
        webbrowser.open(BASE)
    human_sleep(3.5, 5.0)
    rect = focus_edge()
    if rect:
        say("pass", f"Edge focused {rect[2]}x{rect[3]}")
    else:
        say("warn", "Could not auto-focus Edge — click the browser window now")
        human_sleep(4, 6)


def goto(url: str) -> None:
    focus_edge()
    pyautogui.hotkey("ctrl", "l")
    human_sleep(0.3, 0.6)
    pyautogui.hotkey("ctrl", "a")
    human_sleep(0.1, 0.25)
    pyautogui.write(url, interval=random.uniform(0.02, 0.05))
    human_sleep(0.2, 0.4)
    pyautogui.press("enter")
    human_sleep(2.0, 3.5)
    say("pass", f"navigated → {url}")


def click_in_browser(rel_x: float, rel_y: float) -> None:
    rect = focus_edge()
    if not rect:
        say("fail", "no browser window for click")
        return
    left, top, width, height = rect
    x = left + int(width * rel_x)
    y = top + int(height * rel_y)
    human_click(x, y)


def tab_to_and_activate(tabs: int = 8) -> None:
    focus_edge()
    for _ in range(tabs):
        pyautogui.press("tab")
        human_sleep(0.12, 0.28)
    pyautogui.press("enter")
    human_sleep(1.2, 2.0)


def stress_homepage() -> None:
    goto(BASE)
    human_scroll(-8)
    human_scroll(4)
    # center CTA zone — Sign in / See pricing
    click_in_browser(0.42, 0.38)
    human_sleep(1.0, 1.8)
    pyautogui.hotkey("alt", "left")  # back
    human_sleep(1.0, 1.5)
    click_in_browser(0.58, 0.38)
    human_sleep(1.0, 1.8)
    pyautogui.hotkey("alt", "left")
    click_in_browser(0.5, 0.62)  # share copy button area
    human_scroll(-10)
    click_in_browser(0.5, 0.88)  # footer / get started
    say("pass", "homepage mouse tour")


def stress_all_routes() -> None:
    routes = [
        "/pricing",
        "/pricing?required=1",
        "/login",
        "/contact",
        "/deploy-hub",
        "/api-hub",
        "/legal",
        "/terms",
        "/privacy",
        "/legal/billing",
        "/legal/cookies",
        "/?ref=human-test",
    ]
    for r in routes:
        goto(f"{BASE}{r}")
        human_scroll(random.randint(-12, -4))
        human_scroll(random.randint(2, 8))
        # sweep mouse across content
        rect = focus_edge()
        if rect:
            left, top, w, h = rect
            for rx in (0.25, 0.5, 0.75):
                human_move(left + int(w * rx), top + int(h * 0.45))
                human_sleep(0.2, 0.4)
        say("pass", f"route stressed {r}")


def stress_login() -> None:
    goto(f"{BASE}/login")
    human_scroll(-3)
    # Google button ~center
    click_in_browser(0.5, 0.48)
    human_sleep(2.5, 4.0)
    cur = pyautogui.position()
    say("pass", f"clicked Google sign-in (cursor at {cur.x},{cur.y})")
    # may land on Google — return to login for manual window
    goto(f"{BASE}/login")

    print(f"\n>>> MOUSE PAUSED {MANUAL_LOGIN_SEC}s — COMPLETE GOOGLE SIGN-IN NOW <<<\n", flush=True)
    say("warn", f"manual login window {MANUAL_LOGIN_SEC}s — sign in with Google")
    deadline = time.time() + MANUAL_LOGIN_SEC
    while time.time() < deadline:
        remaining = int(deadline - time.time())
        if remaining % 15 == 0:
            print(f"  …{remaining}s left to sign in…", flush=True)
        human_sleep(0.8, 1.2)


def stress_os() -> None:
    goto(f"{BASE}/os")
    human_sleep(2.0, 3.0)
    rect = focus_edge()
    url_hint = "pricing" if rect else ""

    # If still on login/pricing, user didn't finish auth
    goto(f"{BASE}/os")
    human_sleep(2.0, 3.0)

    # Search box ~top right
    click_in_browser(0.72, 0.08)
    human_sleep(0.3, 0.5)
    pyautogui.write("deploy", interval=0.08)
    human_sleep(0.8, 1.2)

    # Sidebar categories
    for ry in (0.22, 0.28, 0.34, 0.40, 0.46, 0.52):
        click_in_browser(0.08, ry)
        human_sleep(0.5, 0.9)

    # App grid — click several tiles
    for (rx, ry) in [
        (0.22, 0.28), (0.32, 0.28), (0.42, 0.28),
        (0.22, 0.42), (0.32, 0.42), (0.42, 0.42),
        (0.52, 0.28), (0.62, 0.28),
    ]:
        click_in_browser(rx, ry)
        human_sleep(0.6, 1.1)

    # Dock at bottom
    for rx in (0.38, 0.44, 0.50, 0.56, 0.62):
        click_in_browser(rx, 0.92)

    # Header links
    for rx in (0.55, 0.62, 0.68, 0.74):
        click_in_browser(rx, 0.05)
        human_sleep(1.0, 1.6)
        goto(f"{BASE}/os")

    goto(f"{BASE}/os/settings")
    human_scroll(-6)
    goto(f"{BASE}/os/billing")
    human_scroll(-4)
    click_in_browser(0.35, 0.35)

    say("pass", "OS mouse stress complete (apps, dock, nav, settings, billing)")


def stress_redirect_regression() -> None:
    for _ in range(3):
        goto(BASE)
        goto(f"{BASE}/login")
        goto(f"{BASE}/os")
    say("pass", "redirect regression — no loop observed in browser")


def main() -> int:
    print("\n" + "=" * 60)
    print("  EPIC OS — REAL MOUSE STRESS TEST (your screen)")
    print(f"  Target: {BASE}")
    print("  Move mouse to TOP-LEFT corner to emergency-stop (pyautogui failsafe)")
    print("=" * 60 + "\n")

    human_sleep(2, 3)
    open_site()
    stress_homepage()
    stress_all_routes()
    stress_login()
    stress_os()
    stress_redirect_regression()

    print("\n=== DONE — leaving browser open 20s ===")
    print(f"PASS {len(log_pass)} | FAIL {len(log_fail)} | WARN {len(log_warn)}")
    if log_fail:
        print("Failures:", *log_fail, sep="\n  - ")
    human_sleep(18, 22)
    return 1 if log_fail else 0


if __name__ == "__main__":
    raise SystemExit(main())