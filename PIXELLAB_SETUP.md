# PixelLab MCP Setup for Sprite Generation

## Install the MCP

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "pixellab": {
      "url": "https://api.pixellab.ai/mcp",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    }
  }
}
```

Get your API token at: https://www.pixellab.ai

## Generate Sprites

Once the MCP is active, Claude can generate sprites directly:
- 4 directional character walk cycles
- Office worker characters (male/female)
- 32×48 pixel art, top-down/3/4 view

## Expected file structure

```
public/sprites/
  dev-walk.png     (32×48 × 4 frames = 128×48 sprite sheet)
  dev-sit.png
  ai-walk.png
  ai-sit.png
  auto-walk.png
  auto-sit.png
  agent-walk.png
  agent-sit.png
```

## Integrate in services[]

```typescript
imageSprite: {
  walkSrc: "/sprites/dev-walk.png",
  sitSrc: "/sprites/dev-sit.png",
  frameW: 32, frameH: 48,
  walkFrames: 4, sitFrames: 1,
  fps: 8,
}
```
