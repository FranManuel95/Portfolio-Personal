# Sprites — Oficina Agéntica

Los sprites pixel-art de los personajes y mobiliario se generan con la **API REST de PixelLab.ai**. Hasta que se generen, los componentes usan un fallback SVG.

## Generar los sprites

Requisitos:

- Python 3.8+
- `pip install Pillow` (para componer walk cycles)
- API key de PixelLab (registro gratis en https://pixellab.ai)

Ejecutar **desde la raíz del proyecto**:

```bash
export PIXELLAB_API_KEY="tu-api-key"
python3 scripts/generate-sprites.py
```

El script:

- Verifica balance antes de gastar
- Genera 4 walk cycles de personajes (4 frames cada uno, 64×64)
- Genera 4 idle poses
- Genera 8 piezas de mobiliario
- Genera 4 tiles de suelo/pared
- **Es idempotente**: si un PNG ya existe, lo omite. Para regenerar uno, bórralo y vuelve a correr.

## Sprites esperados

### Personajes (walk cycle strips, 256×64 = 4 frames 64×64)

| Archivo | Descripción |
|---|---|
| `dev-walk.png` | Full-stack dev, sudadera azul |
| `ai-walk.png` | AI architect, blazer navy |
| `auto-walk.png` | Automation engineer, henley naranja |
| `agent-walk.png` | Agent specialist, headset, blusa roja |

### Idle poses (64×64 single frame)

| Archivo | Descripción |
|---|---|
| `dev-idle.png`, `ai-idle.png`, `auto-idle.png`, `agent-idle.png` | poses estáticas |

### Mobiliario (64×64)

| Archivo | Uso |
|---|---|
| `furn-desk.png` | Escritorio con monitores duales |
| `furn-chair.png` | Silla ergonómica |
| `furn-server.png` | Rack de servidores con LEDs |
| `furn-plant.png` | Planta (monstera) |
| `furn-whiteboard.png` | Pizarra con diagramas |
| `furn-bookshelf.png` | Estantería |
| `furn-coffee.png` | Cafetera espresso |
| `furn-lamp.png` | Lámpara de pie |

### Tiles (32×32, seamless)

| Archivo | Uso |
|---|---|
| `tile-floor-wood.png` | Suelo de madera |
| `tile-wall-brick.png` | Pared ladrillo |
| `tile-wall-office.png` | Pared oficina pintada |
| `tile-carpet.png` | Moqueta gris |

## Costes estimados

PixelLab cobra por generación. Referencia aproximada por sprite 64×64:

- Estático (pixflux): ~$0.01
- Animado (4 frames): ~$0.04

Total para todos los sprites del portfolio: **~$0.50 USD** (una sola vez).

## Personalizar

Edita los prompts en `scripts/generate-sprites.py`. Las prompts actuales están ajustadas para estilo pixel-art con outline negro simple y sombreado básico. Para un estilo diferente modifica los campos `outline`, `shading`, `detail`, `view` según la documentación de PixelLab.
