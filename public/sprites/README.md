# /public/sprites/

This directory holds PNG sprite sheets for the Services section characters.

When PixelLab-generated sprites are dropped here, the `ImageSprite` component
in `Services.tsx` will automatically prefer them over the SVG-rect fallback.

## Expected files

| File            | Description                        | Dimensions (example)   |
|-----------------|------------------------------------|------------------------|
| dev-walk.png    | Developer walk cycle (4 frames)    | 128 × 48 px            |
| dev-sit.png     | Developer sitting (1–2 frames)     | 64 × 48 px             |
| ai-walk.png     | AI Architect walk cycle            | 128 × 48 px            |
| ai-sit.png      | AI Architect sitting               | 64 × 48 px             |
| auto-walk.png   | Automation Hacker walk cycle       | 128 × 48 px            |
| auto-sit.png    | Automation Hacker sitting          | 64 × 48 px             |
| agent-walk.png  | Agent Whisperer walk cycle         | 128 × 48 px            |
| agent-sit.png   | Agent Whisperer sitting            | 64 × 48 px             |

## Sprite sheet layout

Each PNG is a horizontal strip of frames, all the same size.
Row layout (for multi-directional sheets):
- Row 0: walk facing down  (or idle)
- Row 1: walk facing left
- Row 2: walk facing right
- Row 3: walk facing up

For simple single-row walk cycles, row 0 is used by default.

## Registering a sprite in services[]

Add an `imageSprite` key to the relevant entry in the `services` array in
`src/components/Services.tsx`:

```typescript
imageSprite: {
  walkSrc: "/sprites/dev-walk.png",
  sitSrc:  "/sprites/dev-sit.png",
  frameW: 32,
  frameH: 48,
  walkFrames: 4,
  sitFrames: 1,
  fps: 8,
},
```

When `imageSprite` is present, the `CharacterActor` renders an `ImageSprite`
(PNG-based, CSS background-position animation) instead of the SVG-rect
`PixelSprite`. The SVG fallback remains fully intact for all entries that do
not have `imageSprite` set.
