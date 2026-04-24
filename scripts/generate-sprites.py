#!/usr/bin/env python3
"""
Genera todos los sprites pixel-art del portfolio vía PixelLab REST API.

Uso:
    export PIXELLAB_API_KEY="..."
    python3 scripts/generate-sprites.py

Todos los sprites se guardan en public/sprites/. El script es idempotente:
omite sprites que ya existen (borra manualmente los PNGs que quieras regenerar).

Endpoints:
  POST /v1/generate-image-pixflux  → sprite estático
  POST /v1/animate-with-text       → walk cycle (4 frames)

Respuesta: {"image": {"base64": "..."}} o {"images": [{"base64": "..."}, ...]}
"""
from __future__ import annotations

import base64
import json
import os
import sys
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

API_KEY = os.environ.get("PIXELLAB_API_KEY", "92242b00-8d50-4d6b-a2b4-a1e06051e364")
BASE = "https://api.pixellab.ai/v1"
OUT = Path(__file__).resolve().parent.parent / "public" / "sprites"
OUT.mkdir(parents=True, exist_ok=True)


def post(path: str, payload: dict) -> dict:
    """POST JSON, return parsed JSON response. Retries 3x on transient errors."""
    req = Request(
        f"{BASE}{path}",
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    for attempt in range(3):
        try:
            with urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            print(f"  ! HTTP {e.code}: {body[:300]}")
            if e.code in (429, 500, 502, 503, 504) and attempt < 2:
                wait = 2 ** (attempt + 1)
                print(f"  retrying in {wait}s...")
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("exhausted retries")


def save_b64(b64: str, name: str) -> Path:
    path = OUT / name
    path.write_bytes(base64.b64decode(b64))
    return path


def gen_static(name: str, description: str, size: int = 64, view: str = "side", **extra) -> Path | None:
    """Genera un sprite estático."""
    path = OUT / name
    if path.exists():
        print(f"  ∘ {name} (ya existe, skip)")
        return path
    print(f"  → {name}: {description[:60]}...")
    payload = {
        "description": description,
        "image_size": {"width": size, "height": size},
        "no_background": True,
        "outline": "single color black outline",
        "shading": "basic shading",
        "detail": "medium detail",
        "view": view,
        "direction": "south",
        "text_guidance_scale": 8,
        **extra,
    }
    try:
        r = post("/generate-image-pixflux", payload)
        b64 = r.get("image", {}).get("base64")
        if not b64:
            print(f"  ! respuesta sin imagen: {json.dumps(r)[:200]}")
            return None
        save_b64(b64, name)
        print(f"  ✓ {name}")
        return path
    except Exception as e:
        print(f"  ✗ {name} falló: {e}")
        return None


def gen_walk(name: str, description: str, size: int = 64) -> Path | None:
    """Genera un walk cycle horizontal strip (4 frames, lado a lado).
    Estrategia: genera 4 frames individuales con variación textual, compone strip.
    Si animate-with-text está disponible, lo usa en su lugar.
    """
    path = OUT / name
    if path.exists():
        print(f"  ∘ {name} (ya existe, skip)")
        return path
    print(f"  → {name} (walk cycle): {description[:60]}...")
    # Intento 1: animate-with-text
    payload = {
        "description": description,
        "action": "walking forward",
        "image_size": {"width": size, "height": size},
        "n_frames": 4,
        "view": "side",
        "direction": "south",
        "no_background": True,
        "outline": "single color black outline",
        "shading": "basic shading",
        "text_guidance_scale": 8,
    }
    try:
        r = post("/animate-with-text", payload)
        frames_b64 = [im["base64"] for im in r.get("images", [])]
        if len(frames_b64) < 4:
            raise ValueError(f"solo {len(frames_b64)} frames devueltos")
        # Compose horizontal strip con PIL
        from PIL import Image
        from io import BytesIO
        frames = [Image.open(BytesIO(base64.b64decode(b))).convert("RGBA") for b in frames_b64[:4]]
        strip = Image.new("RGBA", (size * 4, size), (0, 0, 0, 0))
        for i, f in enumerate(frames):
            strip.paste(f, (i * size, 0))
        strip.save(path)
        print(f"  ✓ {name} (strip {size*4}x{size})")
        return path
    except Exception as e:
        print(f"  ✗ {name} animate-with-text falló ({e}), fallback a frame único")
        return gen_static(name, description, size)


def main() -> int:
    if not API_KEY or API_KEY == "your-api-key-here":
        print("ERROR: exporta PIXELLAB_API_KEY antes de correr el script.")
        return 1

    print(f"PixelLab → {OUT}")
    # Verificar balance
    try:
        req = Request(
            f"{BASE}/balance",
            headers={"Authorization": f"Bearer {API_KEY}"},
        )
        with urlopen(req, timeout=20) as r:
            bal = json.loads(r.read())
        print(f"Balance: {bal}")
    except Exception as e:
        print(f"! No se pudo leer balance: {e}")

    print("\n=== Personajes (walk cycles, 64x64, 4 frames) ===")
    gen_walk(
        "dev-walk.png",
        "full stack developer, male, messy brown hair, glasses, blue hoodie, dark jeans, sneakers, pixel art character",
    )
    gen_walk(
        "ai-walk.png",
        "AI architect, female, dark hair in ponytail, navy blazer, white shirt, pixel art character",
    )
    gen_walk(
        "auto-walk.png",
        "automation engineer, male, short sandy hair, orange henley shirt, olive cargo pants, pixel art character",
    )
    gen_walk(
        "agent-walk.png",
        "agent specialist, female, auburn long hair, red blouse, black skirt, headset, pixel art character",
    )

    print("\n=== Idle poses (64x64) ===")
    gen_static("dev-idle.png", "full stack developer standing idle, pixel art character, blue hoodie")
    gen_static("ai-idle.png",  "AI architect standing idle, pixel art character, navy blazer")
    gen_static("auto-idle.png","automation engineer standing idle, pixel art character, orange shirt")
    gen_static("agent-idle.png","agent specialist standing idle, pixel art character, red blouse headset")

    print("\n=== Mobiliario (64x64, top-down / side) ===")
    gen_static("furn-desk.png",      "modern office desk with dual monitors and keyboard, pixel art", view="side")
    gen_static("furn-chair.png",     "ergonomic office chair black, pixel art", view="side")
    gen_static("furn-server.png",    "server rack with blinking LEDs, pixel art", view="side")
    gen_static("furn-plant.png",     "potted monstera plant, pixel art", view="side")
    gen_static("furn-whiteboard.png","whiteboard with diagrams, pixel art", view="side")
    gen_static("furn-bookshelf.png", "wooden bookshelf with books, pixel art", view="side")
    gen_static("furn-coffee.png",    "espresso coffee machine, pixel art", view="side")
    gen_static("furn-lamp.png",      "floor lamp glowing warm light, pixel art", view="side")

    print("\n=== Tiles de suelo / pared (32x32) ===")
    gen_static("tile-floor-wood.png", "wooden plank floor tile seamless, pixel art", size=32, view="high top-down")
    gen_static("tile-wall-brick.png", "brick wall tile seamless, pixel art", size=32, view="side")
    gen_static("tile-wall-office.png","painted office wall tile seamless, pixel art", size=32, view="side")
    gen_static("tile-carpet.png",     "gray carpet tile seamless, pixel art", size=32, view="high top-down")

    print("\nListo. Los sprites están en public/sprites/")
    print("Para regenerar uno: borra el PNG y vuelve a correr este script.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
