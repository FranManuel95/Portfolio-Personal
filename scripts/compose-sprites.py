#!/usr/bin/env python3
"""
LPC sprite composer — stacks body/hair/clothing layers and extracts walk cycle frames.

LPC standard layout (832×1344, 13 cols × 21 rows of 64px):
  Row 8:  Walk South (toward viewer)   ← what we want for front-facing
  Row 9:  Walk West (leftward)
  Row 10: Walk East (rightward)
  Row 11: Walk North (away from viewer)

Each row has 9 animation frames. We extract frames 1-4 (skip frame 0/neutral)
and save as a horizontal strip: 4 frames × 64px wide = 256px, 64px tall.

Extended LPC (832×2944, 13 cols × 46 rows):
  Walk South starts at row 8 same as standard.
"""

from PIL import Image
import os

SPRITES_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "sprites")
FRAME_W = 64
FRAME_H = 64
WALK_FRAMES = 9  # LPC has 9 frames per direction
OUTPUT_FRAMES = 4  # extract frames for output

def load(filename):
    path = os.path.join(SPRITES_DIR, filename)
    img = Image.open(path).convert("RGBA")
    print(f"  Loaded {filename}: {img.size}")
    return img

def composite(*layers):
    base = Image.new("RGBA", layers[0].size, (0, 0, 0, 0))
    for layer in layers:
        base = Image.alpha_composite(base, layer)
    return base

def extract_walk_row(sheet, direction_row=8, num_frames=OUTPUT_FRAMES, start_frame=1):
    """Extract `num_frames` frames from a specific direction row."""
    frames = []
    y = direction_row * FRAME_H
    for i in range(start_frame, start_frame + num_frames):
        x = i * FRAME_W
        frame = sheet.crop((x, y, x + FRAME_W, y + FRAME_H))
        frames.append(frame)
    return frames

def make_strip(frames):
    """Stitch frames into a horizontal strip."""
    strip = Image.new("RGBA", (FRAME_W * len(frames), FRAME_H), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        strip.paste(frame, (i * FRAME_W, 0))
    return strip

def save_strip(strip, name, height_override=48):
    """Save strip, optionally rescaling height to match target dimensions."""
    if height_override and strip.height != height_override:
        w = strip.width
        h = height_override
        strip = strip.resize((w, h), Image.NEAREST)
    out_path = os.path.join(SPRITES_DIR, name)
    strip.save(out_path)
    print(f"  Saved: {name} ({strip.size})")

# ---------------------------------------------------------------------------
# Character 1: DEV — male full-stack (navy jacket, plain black hair)
# ---------------------------------------------------------------------------
print("\n=== DEV (male, navy jacket) ===")
try:
    # All standard-format 832×1344 layers — skip extended-format legs (different size)
    base = load("lpc-body-male-light.png")
    target_size = base.size  # (832, 1344)

    def load_fit(filename):
        img = load(filename)
        if img.size != target_size:
            img = img.resize(target_size, Image.NEAREST)
        return img

    sheet = composite(
        base,
        load_fit("lpc-jacket-collared-male-navy.png"),
        load_fit("lpc-shoes-male-black.png"),
        load_fit("lpc-hair-plain-male-black.png"),
    )
    frames = extract_walk_row(sheet, direction_row=8, num_frames=OUTPUT_FRAMES, start_frame=1)
    strip = make_strip(frames)
    save_strip(strip, "dev-walk-lpc.png", height_override=48)
    print("  DEV done ✓")
except Exception as e:
    print(f"  DEV failed: {e}")

# ---------------------------------------------------------------------------
# Character 2: AUTO — male automation (makrohn teal pants + white shirt)
# ---------------------------------------------------------------------------
print("\n=== AUTO (male, casual) ===")
try:
    layers = [
        load("lpc-body-male-light.png"),
        load("lpc-makrohn-shirt-longsleeve-male-white.png"),
        load("lpc-makrohn-pants-male-teal.png"),
        load("lpc-shoes-male-black.png"),
        load("lpc-makrohn-hair-male-shorthawk-black.png"),
    ]
    sheet = composite(*layers)
    frames = extract_walk_row(sheet, direction_row=8, num_frames=OUTPUT_FRAMES, start_frame=1)
    strip = make_strip(frames)
    save_strip(strip, "auto-walk-lpc.png", height_override=48)
    print("  AUTO done ✓")
except Exception as e:
    print(f"  AUTO failed: {e}")

# ---------------------------------------------------------------------------
# Character 3: AI — female architect (sanderfrenken body, navy jacket)
# ---------------------------------------------------------------------------
print("\n=== AI (female, blazer) ===")
try:
    layers = [
        load("lpc-sanderfrenken-body-female-light.png"),
        load("lpc-jacket-collared-male-navy.png"),  # will be cropped to female size
        load("lpc-hair-plain-male-black.png"),
    ]
    # Use female body size (sanderfrenken is 832×2944)
    base = layers[0]
    # Composite jacket on top — resize jacket sheet to match female body dimensions
    jacket = layers[1].resize(base.size, Image.NEAREST)
    hair = layers[2].resize(base.size, Image.NEAREST)
    sheet = composite(base, jacket, hair)
    frames = extract_walk_row(sheet, direction_row=8, num_frames=OUTPUT_FRAMES, start_frame=1)
    strip = make_strip(frames)
    save_strip(strip, "ai-walk-lpc.png", height_override=48)
    print("  AI done ✓")
except Exception as e:
    print(f"  AI failed: {e}")

# ---------------------------------------------------------------------------
# Character 4: AGENT — female voice (sanderfrenken body, messy hair)
# ---------------------------------------------------------------------------
print("\n=== AGENT (female, casual) ===")
try:
    base = load("lpc-sanderfrenken-body-female-light.png")
    hair = load("lpc-makrohn-hair-male-messy-black.png").resize(base.size, Image.NEAREST)
    sheet = composite(base, hair)
    frames = extract_walk_row(sheet, direction_row=8, num_frames=OUTPUT_FRAMES, start_frame=1)
    strip = make_strip(frames)
    save_strip(strip, "agent-walk-lpc.png", height_override=48)
    print("  AGENT done ✓")
except Exception as e:
    print(f"  AGENT failed: {e}")

print("\nDone! New sprites saved with -lpc suffix.")
print("Update imageSprite configs in Services.tsx to use them.")
