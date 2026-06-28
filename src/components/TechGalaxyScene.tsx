"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useLoader, extend, ThreeEvent, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, Billboard, Text, Trail } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getIconTexture } from "./galaxyIcons";

// ─── DATA ────────────────────────────────────────────────────────────────────

type CategoryName =
  | "IA & Agentes"
  | "Automatización"
  | "Frontend"
  | "Backend & BD"
  | "Infra & DevOps";

type SurfaceType = "plasma" | "lava" | "earth" | "gas" | "rocky";

type Service = { headline: string; summary: string; bullets: string[] };

type Category = {
  name: CategoryName;
  brand: string;
  baseColor: string;
  accentColor: string;
  surface: SurfaceType;
  radius: number;
  speed: number; // angular speed (rad/sec)
  techs: string[];
  service: Service;
};

const CATEGORIES: Category[] = [
  {
    name: "IA & Agentes",
    brand: "#00ff87",
    baseColor: "#1eb874",
    accentColor: "#a8ffd0",
    surface: "plasma",
    radius: 4.5,
    speed: 0.09,
    techs: ["Claude", "OpenAI", "Gemini", "DeepSeek", "MCP", "Skills", "OpenClaw", "RAG", "Pinecone", "File Search"],
    service: {
      headline: "Agentes de IA y RAG en producción",
      summary:
        "Diseño ecosistemas de agentes y sistemas RAG que resuelven tareas reales de negocio — no demos.",
      bullets: [
        "Agentes conversacionales y comerciales (WhatsApp, academia, soporte interno)",
        "RAG sobre documentación especializada (Pinecone, Supabase, Google File Search)",
        "MCP Servers y Skills propios que conectan Claude con tus herramientas y datos",
        "Routing multi-modelo (Claude · OpenAI · Gemini · DeepSeek) optimizando coste",
      ],
    },
  },
  {
    name: "Automatización",
    brand: "#fb923c",
    baseColor: "#c2410c",
    accentColor: "#ffb976",
    surface: "lava",
    radius: 7,
    speed: 0.066,
    techs: ["n8n", "Airtable", "Trello", "Calendly", "UltraMsg", "API"],
    service: {
      headline: "Automatización de procesos con n8n",
      summary:
        "Sustituyo procesos manuales por flujos fiables que corren solos en producción.",
      bullets: [
        "Flujos end-to-end con n8n y Airtable",
        "Integraciones vía API, MCP o Skills (Teachable, Trello, Calendly, WhatsApp)",
        "Onboarding, facturación, avisos y seguimientos sin errores",
      ],
    },
  },
  {
    name: "Frontend",
    brand: "#60a5fa",
    baseColor: "#1e40af",
    accentColor: "#7dd3fc",
    surface: "earth",
    radius: 9.7,
    speed: 0.046,
    techs: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS", "SCSS", "Vite"],
    service: {
      headline: "Interfaces web modernas",
      summary:
        "Aplicaciones rápidas y cuidadas con Next.js y React, listas para producción.",
      bullets: [
        "Apps con Next.js, React y TypeScript",
        "Sistemas de test, flashcards, estadísticas y formularios",
        "Rendimiento, accesibilidad y diseño a medida",
      ],
    },
  },
  {
    name: "Backend & BD",
    brand: "#a78bfa",
    baseColor: "#6d28d9",
    accentColor: "#ddd6fe",
    surface: "gas",
    radius: 12.6,
    speed: 0.034,
    techs: ["Node.js", "Express", "Python", "PHP", "Symfony", "Django", "Supabase", "MySQL", "Postgres"],
    service: {
      headline: "Backend y datos",
      summary: "APIs y bases de datos sólidas que sostienen el producto.",
      bullets: [
        "Node.js, Express y Python; también PHP/Symfony y Django",
        "Supabase, MySQL y PostgreSQL",
        "Arquitectura mantenible, sin deuda técnica innecesaria",
      ],
    },
  },
  {
    name: "Infra & DevOps",
    brand: "#fbbf24",
    baseColor: "#92400e",
    accentColor: "#fde68a",
    surface: "rocky",
    radius: 15.5,
    speed: 0.025,
    techs: ["Linux", "Docker", "Vercel", "Netlify", "Cloudflare", "Azure", "Stripe", "Teachable", "Git"],
    service: {
      headline: "Infraestructura y despliegue",
      summary: "Despliego y opero soluciones estables, de la VPS al edge.",
      bullets: [
        "Docker, VPS Linux, Vercel, Netlify, Cloudflare y Azure",
        "Operación en producción con cientos de usuarios activos",
        "Pagos con Stripe e integraciones cloud",
      ],
    },
  },
];

const RINGED_TECHS = new Set(["Pinecone", "Postgres", "Docker", "n8n"]);
const PLANET_RADIUS = 0.55;

// Shared focus target the camera rig flies to when a planet is selected.
type FocusState = { pos: THREE.Vector3; radius: number; key: string };

type SelectedState = { category: Category; tech: string } | null;

// ─── SHADERS ────────────────────────────────────────────────────────────────

// Sun: animated plasma with fractal noise → looks like real solar surface
const sunVert = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFrag = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;

  // 3D simplex-ish noise (fast, good enough for plasma)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = vec3(vUv * 6.0, uTime * 0.07);
    float n = fbm(p);
    float n2 = fbm(p * 2.2 + vec3(uTime * 0.13));
    float fine = fbm(p * 5.0 - vec3(uTime * 0.05));
    float surface = n * 0.55 + n2 * 0.30 + fine * 0.15;

    // Color ramp — predominantly orange/amber with deep red hollows and warm-yellow peaks
    vec3 c1 = vec3(0.18, 0.02, 0.00); // deep hollow (almost black-red)
    vec3 c2 = vec3(0.65, 0.14, 0.03); // dark orange-red
    vec3 c3 = vec3(0.98, 0.40, 0.06); // bright orange
    vec3 c4 = vec3(1.00, 0.72, 0.20); // warm yellow
    vec3 c5 = vec3(1.00, 0.92, 0.55); // bright yellow (no pure white — keep it 'amarillo')

    float t = surface * 0.5 + 0.5;
    // Stretch midtones (more orange visible)
    t = pow(t, 0.85);
    vec3 col;
    if (t < 0.22)      col = mix(c1, c2, t / 0.22);
    else if (t < 0.5)  col = mix(c2, c3, (t - 0.22) / 0.28);
    else if (t < 0.78) col = mix(c3, c4, (t - 0.5) / 0.28);
    else               col = mix(c4, c5, (t - 0.78) / 0.22);

    // Sunspot/granulation patches — large-scale low-frequency noise carves dark depressions
    float spots = fbm(vec3(vUv * 2.5, uTime * 0.04));
    float spotMask = smoothstep(0.35, 0.55, spots);   // where spots can form
    float spotInner = smoothstep(0.45, 0.7, spots);    // deeper centers
    col = mix(col, col * 0.35, spotMask * 0.55);
    col = mix(col, col * 0.20, spotInner * 0.4);

    // Hot bright filaments along surface granulation
    float hot = smoothstep(0.55, 0.85, fine);
    col += vec3(1.0, 0.85, 0.45) * hot * 0.25;

    // Limb darkening (edge fade for sphere look) — strong, gives 3D ball feel
    float rim = pow(max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 0.5);
    col = mix(col * 0.4, col, rim);

    // Boost emission for bloom (the white-yellow peaks bloom most)
    col *= 1.55;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SunMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime as { value: number }).value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group>
      {/* Sun body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={sunVert}
          fragmentShader={sunFrag}
        />
      </mesh>
      {/* Inner glow — warm amber halo */}
      <mesh>
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshBasicMaterial color="#ffa040" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Outer corona — deeper orange */}
      <mesh>
        <sphereGeometry args={[2.65, 32, 32]} />
        <meshBasicMaterial color="#ff6020" transparent opacity={0.03} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Point light from sun — keeps planets lit but won't wash the void */}
      <pointLight color="#ffb060" intensity={3.0} distance={40} decay={1.8} />
    </group>
  );
}

// ─── PLANET SHADER ──────────────────────────────────────────────────────────

const planetVert = `
  varying vec2 vUv;
  varying vec3 vNormal;       // view-space (for camera-facing rim)
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;  // world-space (for sun lighting/terminator)
  varying vec3 vObjPos;       // object-space position (for stable bump sampling)
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vObjPos = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFrag = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vObjPos;
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uShadow;
  uniform int uSurface;       // 0 plasma 1 lava 2 earth 3 gas 4 rocky
  uniform vec3 uLightDir;     // direction TO sun in world space
  uniform vec3 uCamPos;       // world-space camera position (specular/fresnel)
  uniform float uSelected;    // 0 or 1

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // domain-warped fbm — organic large->small structure (IQ two-level)
  float fbm2(vec3 p) {
    vec3 q = vec3(fbm(p), fbm(p + vec3(5.2, 1.3, 2.7)), fbm(p + vec3(1.7, 9.2, 3.1)));
    return fbm(p + 4.0 * q);
  }

  // per-biome scalar height field (drives both bump and color)
  float heightAt(vec3 sp) {
    if (uSurface == 0) return fbm2(sp * 3.0 + vec3(uTime * 0.15));      // plasma
    else if (uSurface == 1) return fbm2(sp * 4.5);                      // lava
    else if (uSurface == 2) return fbm2(sp * 2.4);                      // earth
    else if (uSurface == 3) return sin(sp.y * 12.0 + fbm(sp * 2.0) * 3.0) * 0.5 + 0.5; // gas bands
    return fbm2(sp * 5.0);                                              // rocky
  }

  vec3 biomeColor(vec3 sp, float h, out float spec, out float emissive) {
    spec = 0.0; emissive = 0.0;
    vec3 col;
    if (uSurface == 0) {
      // PLASMA — ionized swirl, self-lit
      col = mix(uShadow, uBase, h * 0.5 + 0.5);
      col = mix(col, uAccent, smoothstep(0.45, 0.85, h));
      emissive = smoothstep(0.6, 1.0, h) * 0.8;
    } else if (uSurface == 1) {
      // LAVA — basalt with glowing accent cracks
      col = mix(uShadow, uBase, smoothstep(0.0, 0.4, h));
      float cracks = smoothstep(0.55, 0.75, h);
      col = mix(col, uAccent * 1.4, cracks);
      emissive = cracks * 0.9;
      spec = 0.10;
    } else if (uSurface == 2) {
      // EARTH — oceans, continents, ice caps, clouds
      float landMask = smoothstep(0.48, 0.56, h * 0.5 + 0.5);
      vec3 ocean = uShadow;
      vec3 land = mix(uBase, vec3(0.30, 0.55, 0.22), 0.55);
      col = mix(ocean, land, landMask);
      col = mix(col, vec3(0.92), smoothstep(0.78, 0.95, abs(sp.y)));
      float clouds = fbm(sp * 4.0 + vec3(uTime * 0.03));
      col = mix(col, vec3(1.0), smoothstep(0.42, 0.60, clouds) * 0.55);
      spec = (1.0 - landMask) * 0.5;
    } else if (uSurface == 3) {
      // GAS GIANT — latitude bands + storm
      col = mix(uShadow, uBase, h);
      float turb = fbm2(sp * 3.0 + vec3(uTime * 0.04));
      col = mix(col, uAccent, smoothstep(0.62, 1.0, h + turb * 0.25));
      spec = 0.12;
    } else {
      // ROCKY — cratered matte
      col = mix(uShadow, uBase, h * 0.5 + 0.5);
      float craters = smoothstep(0.5, 0.55, fbm(sp * 11.0));
      col = mix(col, vec3(0.08), craters * 0.5);
    }
    return col;
  }

  void main() {
    vec3 sp = normalize(vObjPos);
    float spec, emissive;
    float h = heightAt(sp);
    vec3 surfaceCol = biomeColor(sp, h, spec, emissive);

    // ---- object-space normal-from-noise bump (stable, no screen-space shimmer) ----
    vec3 up = abs(sp.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(sp, up));
    vec3 t2 = normalize(cross(sp, t1));
    float eps = 0.04;
    float hX = heightAt(normalize(sp + t1 * eps));
    float hY = heightAt(normalize(sp + t2 * eps));
    float bumpStrength = uSurface == 4 ? 0.18 : uSurface == 1 ? 0.15 : uSurface == 2 ? 0.12 : 0.06;
    vec3 grad = ((hX - h) * t1 + (hY - h) * t2) / eps;
    vec3 perturbedObj = normalize(sp - grad * bumpStrength);
    vec3 N = normalize(vWorldNormal + (perturbedObj - sp));

    // ---- sun lighting with day/night terminator ----
    vec3 L = normalize(uLightDir);
    float ndl = dot(N, L);
    float lambert = max(0.0, ndl);
    float dayFactor = smoothstep(-0.12, 0.30, ndl);
    vec3 nightCol = surfaceCol * vec3(0.10, 0.12, 0.18); // cool, not black
    vec3 dayCol = surfaceCol * (0.12 + 1.05 * lambert);
    vec3 lit = mix(nightCol, dayCol, dayFactor);

    // warm terminator rim band (where light grazes)
    float term = exp(-pow(ndl / 0.14, 2.0));
    lit += uAccent * term * 0.16 * dayFactor;

    // emissive (plasma glow / lava cracks) — drives bloom, visible day & night
    lit += mix(surfaceCol, uAccent, 0.5) * emissive * 0.7;

    // ---- specular highlight on lit side ----
    vec3 V = normalize(uCamPos - vWorldPos);
    vec3 Hh = normalize(L + V);
    lit += vec3(1.0) * pow(max(0.0, dot(N, Hh)), 32.0) * spec * dayFactor;

    // ---- fresnel atmosphere, brightest on the lit limb ----
    float fres = pow(1.0 - max(0.0, dot(N, V)), 3.0);
    lit += uBase * fres * (0.22 + 0.5 * dayFactor);

    // selected boost
    if (uSelected > 0.5) lit += uAccent * 0.22;

    gl_FragColor = vec4(lit, 1.0);
  }
`;

function surfaceTypeIndex(s: SurfaceType): number {
  return { plasma: 0, lava: 1, earth: 2, gas: 3, rocky: 4 }[s];
}

function Planet({
  category,
  tech,
  index,
  selected,
  setSelected,
  paused,
  speedMul,
  dimmed,
  onActivate,
  focusRef,
}: {
  category: Category;
  tech: string;
  index: number;
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  paused: boolean;
  speedMul: number;
  dimmed: boolean;
  onActivate: () => void;
  focusRef: React.MutableRefObject<FocusState>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const angleRef = useRef((index / category.techs.length) * Math.PI * 2);
  const [hover, setHover] = useState(false);
  const isSelected = selected?.category.name === category.name && selected.tech === tech;

  const logoTex = useMemo(() => getIconTexture(tech), [tech]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBase: { value: new THREE.Color(category.baseColor) },
      uAccent: { value: new THREE.Color(category.accentColor) },
      uShadow: { value: new THREE.Color(category.brand).multiplyScalar(0.1) },
      uSurface: { value: surfaceTypeIndex(category.surface) },
      uLightDir: { value: new THREE.Vector3(0, 0, 0) },
      uCamPos: { value: new THREE.Vector3() },
      uSelected: { value: 0 },
    }),
    [category]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!paused) {
      const dir = category.name === "Automatización" || category.name === "Backend & BD" ? -1 : 1;
      angleRef.current += category.speed * 0.016 * dir * speedMul;
    }
    const x = Math.cos(angleRef.current) * category.radius;
    const z = Math.sin(angleRef.current) * category.radius;
    groupRef.current.position.set(x, 0, z);
    if (meshRef.current) meshRef.current.rotation.y += 0.003;
    if (matRef.current) {
      const u = matRef.current.uniforms;
      (u.uTime as { value: number }).value = state.clock.elapsedTime;
      // light dir = from planet world pos toward the sun (origin)
      (u.uLightDir as { value: THREE.Vector3 }).value.set(-x, 0, -z).normalize();
      (u.uCamPos as { value: THREE.Vector3 }).value.copy(state.camera.position);
      (u.uSelected as { value: number }).value = isSelected ? 1 : 0;
    }
    // Selected planet reports its world position so the camera rig can fly to it.
    if (isSelected) {
      focusRef.current.pos.set(x, 0, z);
      focusRef.current.key = category.name + "/" + tech;
      focusRef.current.radius = PLANET_RADIUS * 1.35;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onActivate();
    setSelected({ category, tech });
  };

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
    setHover(true);
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
    setHover(false);
  };

  const hasRing = RINGED_TECHS.has(tech);
  const planetSize = PLANET_RADIUS * (isSelected ? 1.35 : 1);
  const logoOpacity = dimmed ? 0.18 : isSelected ? 1 : 0.95;

  return (
    <group ref={groupRef} scale={dimmed ? 0.6 : 1} visible>
      <mesh ref={meshRef} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <sphereGeometry args={[planetSize, isSelected ? 64 : 48, isSelected ? 64 : 48]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={planetVert}
          fragmentShader={planetFrag}
        />
      </mesh>

      {hasRing && (
        <mesh rotation={[Math.PI / 2 - 0.4, 0, 0]}>
          <ringGeometry args={[planetSize * 1.45, planetSize * 2.1, 64]} />
          <meshBasicMaterial
            color={category.brand}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Symbol badge — camera-facing, centered on the planet face, clearly inside.
          A soft dark plate sits just behind the glyph so it reads on any surface
          without hiding the planet texture around it. */}
      <Billboard>
        <mesh position={[0, 0, planetSize * 0.9]} raycast={() => null}>
          <circleGeometry args={[planetSize * 0.52, 40]} />
          <meshBasicMaterial color="#050505" transparent opacity={dimmed ? 0.1 : 0.34} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, planetSize * 0.92]} raycast={() => null}>
          <planeGeometry args={[planetSize * 0.8, planetSize * 0.8]} />
          <meshBasicMaterial map={logoTex} transparent depthWrite={false} toneMapped={false} opacity={logoOpacity} />
        </mesh>
      </Billboard>

      {/* Name — ALWAYS visible: crisp outlined 3D text, brighter on hover/selection. */}
      <Billboard position={[0, -(planetSize + 0.42), 0]}>
        <Text
          fontSize={isSelected ? 0.5 : hover ? 0.42 : 0.32}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          outlineOpacity={0.95}
          fillOpacity={dimmed ? 0.2 : isSelected || hover ? 1 : 0.9}
          material-toneMapped={false}
          material-depthWrite={false}
          renderOrder={3}
        >
          {tech}
        </Text>
      </Billboard>
    </group>
  );
}

// ─── ORBIT RINGS ────────────────────────────────────────────────────────────

function OrbitRing({ radius, color, active }: { radius: number; color: string; active: boolean }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial
        color={active ? color : "#ffffff"}
        transparent
        opacity={active ? 0.6 : 0.18}
      />
    </line>
  );
}

// ─── BACKGROUND ─────────────────────────────────────────────────────────────

// Small painted-cloud nebulae — soft fuzzy blobs at fixed positions
function PaintedNebulae() {
  const CLOUDS = useMemo(
    () => [
      { pos: [-30, 8, -28] as [number, number, number], color: "#3b1d6b", scale: 14 },
      { pos: [26, -10, -32] as [number, number, number], color: "#1e3a8a", scale: 16 },
      { pos: [32, 16, -26] as [number, number, number], color: "#5b21b6", scale: 11 },
      { pos: [-34, -6, -22] as [number, number, number], color: "#0e7490", scale: 12 },
      { pos: [-12, 22, -30] as [number, number, number], color: "#831843", scale: 10 },
      { pos: [20, 24, -28] as [number, number, number], color: "#4338ca", scale: 13 },
      { pos: [-24, -18, -24] as [number, number, number], color: "#7e22ce", scale: 9 },
    ],
    []
  );

  return (
    <group>
      {CLOUDS.map((c, i) => (
        <Cloud key={i} position={c.pos} color={c.color} scale={c.scale} seed={i * 17.3} />
      ))}
    </group>
  );
}

function Cloud({ position, color, scale, seed }: { position: [number, number, number]; color: string; scale: number; seed: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime as { value: number }).value = clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} scale={[scale, scale, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uSeed: { value: seed },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uSeed;
          vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0); m=m*m; m=m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 5; i++) { v += a * snoise(p); p *= 2.0; a *= 0.5; }
            return v;
          }
          void main() {
            vec2 uv = vUv - 0.5;
            float d = length(uv);
            // soft fuzzy circular falloff
            float falloff = smoothstep(0.5, 0.05, d);
            // noise warps the edge to make it cloud-like (irregular)
            float n = fbm(vUv * 3.0 + vec2(uSeed) + uTime * 0.02);
            float n2 = fbm(vUv * 6.0 - vec2(uSeed * 0.7));
            float cloud = falloff * (0.55 + n * 0.55) * (0.7 + n2 * 0.3);
            cloud = max(0.0, cloud - 0.15);
            gl_FragColor = vec4(uColor, cloud * 0.28);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── COLORED STARS ─────────────────────────────────────────────────────────

function ColoredStars() {
  // A handful of bright "named" stars in the field — red giants, blue giants, yellow stars
  const { positions, colors, sizes } = useMemo(() => {
    const N = 110;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const palettes = [
      new THREE.Color("#ff4d3a"), // red giant
      new THREE.Color("#ff8c42"), // orange
      new THREE.Color("#fbbf24"), // yellow
      new THREE.Color("#7dd3fc"), // blue
      new THREE.Color("#a78bfa"), // violet
      new THREE.Color("#86efac"), // green
    ];
    for (let i = 0; i < N; i++) {
      // Spread on a sphere outside the orbits (radius 35-65)
      const r = 35 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.7;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = palettes[Math.floor(Math.random() * palettes.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.5 + Math.random() * 1.3;
    }
    return { positions, colors, sizes };
  }, []);

  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime as { value: number }).value = clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={colors.length / 3} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} count={sizes.length} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          uniform float uTime;
          void main() {
            vColor = color;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + position.x * 10.0);
            gl_PointSize = size * twinkle * (160.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            // soft round point with glow falloff
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float core = smoothstep(0.5, 0.0, d);
            float glow = smoothstep(0.5, 0.15, d) * 0.6;
            float a = core + glow;
            if (a < 0.01) discard;
            gl_FragColor = vec4(vColor * (core + glow * 0.5), a);
          }
        `}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── SCENE ─────────────────────────────────────────────────────────────────

function Scene({
  selected,
  setSelected,
  hoveredCategory,
  filterCategory,
  manualPause,
  speedMul,
  live,
  reduceMotion,
  onActivate,
  controlsRef,
  focusRef,
}: {
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  hoveredCategory: string | null;
  filterCategory: string | null;
  manualPause: boolean;
  speedMul: number;
  live: boolean;
  reduceMotion: boolean;
  onActivate: () => void;
  controlsRef: React.MutableRefObject<React.ComponentRef<typeof OrbitControls> | null>;
  focusRef: React.MutableRefObject<FocusState>;
}) {
  // Under reduced motion the system is paused by default (static diagram).
  const paused = manualPause || selected !== null || reduceMotion;

  return (
    <>
      <ambientLight intensity={0.15} />
      <PaintedNebulae />
      <Stars radius={100} depth={50} count={5500} factor={3.5} saturation={0} fade speed={reduceMotion ? 0 : 0.5} />
      <ColoredStars />
      {!reduceMotion && <Meteors />}
      <SunMesh />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enableZoom={live}
        enableRotate={live}
        enablePan={live}
        zoomToCursor
        screenSpacePanning
        panSpeed={0.9}
        autoRotate={!live && !reduceMotion}
        autoRotateSpeed={0.25}
        minDistance={5}
        maxDistance={70}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.72}
        rotateSpeed={0.55}
        zoomSpeed={1.1}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
      <TouchActionManager live={live} />
      <CameraRig focusRef={focusRef} hasSelection={selected !== null} />

      {CATEGORIES.map((c) => {
        const active = selected?.category.name === c.name || hoveredCategory === c.name;
        const dimmed = filterCategory !== null && filterCategory !== c.name;
        return (
          <group key={c.name}>
            <OrbitRing radius={c.radius} color={c.brand} active={active} />
            {c.techs.map((tech, i) => (
              <Planet
                key={tech}
                category={c}
                tech={tech}
                index={i}
                selected={selected}
                setSelected={setSelected}
                paused={paused}
                speedMul={speedMul}
                dimmed={dimmed}
                onActivate={onActivate}
                focusRef={focusRef}
              />
            ))}
          </group>
        );
      })}
    </>
  );
}

// ─── CAMERA RIG — fly-to / zoom any selected planet ─────────────────────────

const ORIGIN = new THREE.Vector3(0, 0, 0);

type RigControls = {
  object: THREE.PerspectiveCamera;
  target: THREE.Vector3;
  minDistance: number;
  maxDistance: number;
  update: () => void;
};

function CameraRig({
  focusRef,
  hasSelection,
}: {
  focusRef: React.MutableRefObject<FocusState>;
  hasSelection: boolean;
}) {
  // `makeDefault` on OrbitControls publishes the instance here.
  const controls = useThree((s) => s.controls) as unknown as RigControls | null;
  const lastKey = useRef<string | null>(null);
  const anim = useRef<{
    from: THREE.Vector3;
    to: THREE.Vector3;
    fromD: number;
    toD: number;
    t: number;
  } | null>(null);

  useFrame((_, delta) => {
    if (!controls) return;
    const key = hasSelection ? focusRef.current.key : null;

    // On selection change, kick off a ONE-SHOT fly-to animation, then release
    // control entirely so free zoom-to-cursor / orbit work between selections.
    if (key !== lastKey.current) {
      lastKey.current = key;
      const active = !!key;
      controls.minDistance = active ? 1.4 : 5;
      anim.current = {
        from: controls.target.clone(),
        to: active ? focusRef.current.pos.clone() : ORIGIN.clone(),
        fromD: controls.object.position.distanceTo(controls.target),
        toD: active ? Math.max(2.2, focusRef.current.radius * 5) : 24,
        t: 0,
      };
    }

    const a = anim.current;
    if (!a) return; // released → user has full free control

    a.t = Math.min(1, a.t + delta / 0.9);
    const e = 1 - Math.pow(1 - a.t, 3); // easeOutCubic
    controls.target.lerpVectors(a.from, a.to, e);
    const d = THREE.MathUtils.lerp(a.fromD, a.toD, e);
    const dir = new THREE.Vector3()
      .subVectors(controls.object.position, controls.target)
      .setLength(d);
    controls.object.position.copy(controls.target).add(dir);
    controls.update();
    if (a.t >= 1) anim.current = null; // release
  });

  return null;
}

// ─── TOUCH-ACTION MANAGER ───────────────────────────────────────────────────
// drei OrbitControls forces gl.domElement.style.touchAction = 'none' on connect,
// which would block vertical page scroll over the canvas in AMBIENT. Re-assert the
// correct value from React state: pan-y (page scrolls) in AMBIENT, none in LIVE.
function TouchActionManager({ live }: { live: boolean }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.style.touchAction = live ? "none" : "pan-y";
  }, [live, gl]);
  return null;
}

// ─── SUN PROXIMITY TRACKER ─────────────────────────────────────────────────

function SunProximityTracker({ onChange }: { onChange: (d: number) => void }) {
  const { camera } = useThree();
  const lastReported = useRef(0);
  useFrame(() => {
    const d = camera.position.length();
    if (Math.abs(d - lastReported.current) > 0.25) {
      lastReported.current = d;
      onChange(d);
    }
  });
  return null;
}

// ─── METEORS (real 3D shooting stars) ───────────────────────────────────────

type MeteorData = {
  id: number;
  start: THREE.Vector3;
  dir: THREE.Vector3;
  accel: THREE.Vector3;
  speed: number;
  life: number;
  headColor: THREE.Color;
  trailColor: THREE.Color;
  size: number;
  width: number;
  length: number;
};

function makeMeteor(id: number): MeteorData {
  const fireball = Math.random() < 0.16;
  // Enter from the upper/background region, drift down and across the view.
  const start = new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(52),
    THREE.MathUtils.randFloat(10, 28),
    THREE.MathUtils.randFloat(-22, 12)
  );
  const dir = new THREE.Vector3(
    THREE.MathUtils.randFloat(-0.6, 0.6),
    THREE.MathUtils.randFloat(-1.0, -0.55),
    THREE.MathUtils.randFloat(-0.3, 0.35)
  ).normalize();
  // gentle downward "gravity" + sideways drift → natural arc rather than a straight line
  const accel = new THREE.Vector3(
    THREE.MathUtils.randFloat(-0.4, 0.4),
    THREE.MathUtils.randFloat(-1.6, -0.7),
    THREE.MathUtils.randFloat(-0.3, 0.3)
  );
  const headColor = fireball ? new THREE.Color("#fff0d8") : new THREE.Color("#eaf3ff");
  const trailColor = fireball
    ? new THREE.Color("#ff9d52") // warm ionized tail
    : Math.random() < 0.5
    ? new THREE.Color("#9fc3ff")
    : new THREE.Color("#cfe0ff");
  return {
    id,
    start,
    dir,
    accel,
    speed: fireball ? THREE.MathUtils.randFloat(5, 9) : THREE.MathUtils.randFloat(6, 13),
    life: THREE.MathUtils.randFloat(2.2, 4.0),
    headColor,
    trailColor,
    size: fireball ? 0.26 : THREE.MathUtils.randFloat(0.07, 0.14),
    width: fireball ? 0.8 : THREE.MathUtils.randFloat(0.16, 0.34),
    length: fireball ? 26 : Math.round(THREE.MathUtils.randFloat(14, 22)),
  };
}

function Meteor({ data, onDone }: { data: MeteorData; onDone: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    t.current += Math.min(delta, 0.05);
    const tt = t.current;
    const m = ref.current;
    if (m) {
      // position with a slight gravitational arc: p = start + dir*v*t + ½·a·t²
      m.position
        .copy(data.start)
        .addScaledVector(data.dir, tt * data.speed)
        .addScaledVector(data.accel, 0.5 * tt * tt);
      // head brightness: quick ignition, long natural fade-out, subtle slow flicker
      const k = tt / data.life;
      const fadeIn = Math.min(1, k * 6);
      const fadeOut = 1 - THREE.MathUtils.smoothstep(k, 0.6, 1.0);
      const flicker = 0.9 + 0.1 * Math.sin(tt * 18);
      const head = fadeIn * fadeOut * flicker;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = head;
      m.scale.setScalar(data.size * (0.92 + 0.08 * Math.sin(tt * 12)));
      if (haloRef.current) {
        (haloRef.current.material as THREE.MeshBasicMaterial).opacity = head * 0.28;
      }
    }
    if (!done.current && tt >= data.life) {
      done.current = true;
      onDone();
    }
  });

  return (
    <Trail
      width={data.width}
      length={data.length}
      color={data.trailColor}
      attenuation={(w) => w * w}
      decay={1.0}
    >
      <mesh ref={ref} position={data.start}>
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshBasicMaterial
          color={data.headColor}
          transparent
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
        {/* soft atmospheric glow halo around the head */}
        <mesh ref={haloRef} scale={3.4}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial
            color={data.trailColor}
            transparent
            opacity={0.25}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </mesh>
    </Trail>
  );
}

function Meteors() {
  const [list, setList] = useState<MeteorData[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    let alive = true;
    let timeout: ReturnType<typeof setTimeout>;
    const spawn = () => {
      if (!alive) return;
      // occasionally a quick double/triple "shower"
      const burst = Math.random() < 0.25 ? 2 : 1;
      setList((l) => {
        const next = [...l];
        for (let i = 0; i < burst; i++) next.push(makeMeteor(idRef.current++));
        return next;
      });
      timeout = setTimeout(spawn, THREE.MathUtils.randFloat(1700, 4200));
    };
    timeout = setTimeout(spawn, 700);
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, []);

  const remove = useCallback((id: number) => {
    setList((l) => l.filter((m) => m.id !== id));
  }, []);

  return (
    <>
      {list.map((m) => (
        <Meteor key={m.id} data={m} onDone={() => remove(m.id)} />
      ))}
    </>
  );
}

// ─── PUBLIC COMPONENT ──────────────────────────────────────────────────────

const POLAR_MIN = Math.PI * 0.12;
const POLAR_MAX = Math.PI * 0.72;

export default function TechGalaxyScene() {
  const [selected, setSelected] = useState<SelectedState>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [manualPause, setManualPause] = useState(false);
  const [speedMul, setSpeedMul] = useState<0.5 | 1 | 2>(1);
  const [sunDistance, setSunDistance] = useState(27);
  const [live, setLive] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [status, setStatus] = useState("");
  const reduceMotion = useReducedMotion() ?? false;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls> | null>(null);
  const tapRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const focusRef = useRef<FocusState>({ pos: new THREE.Vector3(), radius: PLANET_RADIUS, key: "" });

  // Closer to sun (14) → brighter glow; far (28+) → none
  const glowIntensity = Math.max(0, Math.min(1, (28 - sunDistance) / 14));

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const activate = useCallback(() => {
    setLive((prev) => {
      if (!prev) setStatus("Modo exploración activado. Arrastra para rotar, rueda o teclas + / − para zoom, flechas para girar, Escape para salir.");
      return true;
    });
  }, []);

  const deactivate = useCallback(() => {
    setLive((prev) => {
      if (prev) setStatus("Modo exploración desactivado. La página vuelve a desplazarse con normalidad.");
      return false;
    });
  }, []);

  // ── Imperative camera helpers (keyboard + on-screen buttons) ──
  type Ctl = {
    object: THREE.PerspectiveCamera;
    target: THREE.Vector3;
    minDistance: number;
    maxDistance: number;
    getAzimuthalAngle: () => number;
    getPolarAngle: () => number;
    setAzimuthalAngle: (a: number) => void;
    setPolarAngle: (a: number) => void;
    update: () => void;
  };
  const rotateAzimuth = useCallback((delta: number) => {
    const c = controlsRef.current as unknown as Ctl | null;
    if (!c) return;
    c.setAzimuthalAngle(c.getAzimuthalAngle() + delta);
    c.update();
  }, []);
  const rotatePolar = useCallback((delta: number) => {
    const c = controlsRef.current as unknown as Ctl | null;
    if (!c) return;
    c.setPolarAngle(THREE.MathUtils.clamp(c.getPolarAngle() + delta, POLAR_MIN, POLAR_MAX));
    c.update();
  }, []);
  const dolly = useCallback((factor: number) => {
    const c = controlsRef.current as unknown as Ctl | null;
    if (!c) return;
    const minD = c.minDistance ?? 5;
    const maxD = c.maxDistance ?? 70;
    const dir = new THREE.Vector3().subVectors(c.object.position, c.target);
    const dist = THREE.MathUtils.clamp(dir.length() * factor, minD, maxD);
    dir.setLength(dist);
    c.object.position.copy(c.target).add(dir);
    c.update();
    setStatus(`Zoom ${Math.round(((maxD - dist) / (maxD - minD)) * 100)}%`);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          activate();
          break;
        case "Escape":
          deactivate();
          break;
        case "ArrowLeft":
          e.preventDefault(); activate(); rotateAzimuth(-0.2); break;
        case "ArrowRight":
          e.preventDefault(); activate(); rotateAzimuth(0.2); break;
        case "ArrowUp":
          e.preventDefault(); activate(); rotatePolar(-0.12); break;
        case "ArrowDown":
          e.preventDefault(); activate(); rotatePolar(0.12); break;
        case "+":
        case "=":
          e.preventDefault(); activate(); dolly(0.85); break;
        case "-":
        case "_":
          e.preventDefault(); activate(); dolly(1.18); break;
      }
    },
    [activate, deactivate, rotateAzimuth, rotatePolar, dolly]
  );

  // Exit LIVE on outside pointerdown / window blur / global Esc
  useEffect(() => {
    if (!live) return;
    const onDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) deactivate();
    };
    const onBlur = () => deactivate();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") deactivate();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKey);
    };
  }, [live, deactivate]);

  // Auto-exit when the canvas scrolls mostly out of view (failsafe)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.4) deactivate();
      },
      { threshold: [0, 0.4, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [deactivate]);

  const activeCat = filterCategory
    ? CATEGORIES.find((c) => c.name === filterCategory) ?? null
    : null;

  return (
    <div className="w-full relative">
      {/* Visually-hidden live region for screen readers */}
      <p
        aria-live="polite"
        className="sr-only"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}
      >
        {status}
      </p>

      {/* Global illumination — bathes the page warm when zoomed toward the sun */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          inset: "-25% -8%",
          background: `radial-gradient(ellipse at center, rgba(255, 160, 60, ${
            glowIntensity * 0.32
          }) 0%, rgba(255, 100, 30, ${glowIntensity * 0.14}) 25%, transparent 60%)`,
          zIndex: 3,
          mixBlendMode: "screen",
          transition: "background 0.2s",
        }}
      />

      {/* Canvas band — full viewport width. role=application + tabIndex makes it a
          focusable, keyboard-operable region. data-galaxy-canvas only while LIVE so
          Lenis lets the page scroll in AMBIENT and hands wheel/touch to the scene in LIVE. */}
      <div
        ref={wrapperRef}
        data-galaxy-canvas={live ? "" : undefined}
        role="application"
        tabIndex={0}
        aria-label="Sistema solar interactivo de mi stack tecnológico. Pulsa Entrar para explorar; usa las flechas para rotar, las teclas más y menos para zoom y Escape para salir. La lista de tecnologías está disponible más abajo."
        onPointerDown={(e) => {
          // Record start; only a genuine TAP (small move, short time) activates —
          // so a vertical scroll-swipe over the canvas still scrolls the page.
          tapRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
        }}
        onPointerUp={(e) => {
          const d = tapRef.current;
          tapRef.current = null;
          if (live || !d) return;
          const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
          if (moved < 10 && Date.now() - d.t < 300) activate();
        }}
        onKeyDown={onKeyDown}
        className="relative outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]/60"
        style={{
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          aspectRatio: "21 / 9",
          maxHeight: "80vh",
          zIndex: 2,
          touchAction: live ? "none" : "pan-y",
          cursor: live ? "grab" : "pointer",
        }}
      >
        {/* Edge fade — softens canvas content into project bg */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(8,8,8,0.55) 80%, var(--bg) 100%)",
            zIndex: 4,
          }}
        />
        <Canvas
          camera={{ position: [0, 3.2, 27], fov: 52, near: 0.1, far: 200 }}
          dpr={coarse ? [1, 1.75] : [1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <SunProximityTracker onChange={setSunDistance} />
            <Scene
              selected={selected}
              setSelected={setSelected}
              hoveredCategory={hoveredCategory}
              filterCategory={filterCategory}
              manualPause={manualPause}
              speedMul={speedMul}
              live={live}
              reduceMotion={reduceMotion}
              onActivate={activate}
              controlsRef={controlsRef}
              focusRef={focusRef}
            />
            <EffectComposer>
              <Bloom
                intensity={0.55}
                luminanceThreshold={0.75}
                luminanceSmoothing={0.15}
                kernelSize={KernelSize.MEDIUM}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>

        {/* AMBIENT affordance */}
        {!live && (
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 bottom-[8%] px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] pointer-events-none"
            style={{
              zIndex: 6,
              color: "var(--text)",
              background: "rgba(8,8,8,0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid var(--line)",
            }}
          >
            {coarse ? "Toca para explorar" : "Clic para explorar · arrastra rota · scroll zoom"}
          </div>
        )}

        {/* LIVE chrome: exit + accessible camera controls */}
        {live && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deactivate();
              }}
              className="absolute top-3 right-3 px-3 py-2 text-[10px] font-mono uppercase tracking-widest"
              style={{
                zIndex: 6,
                color: "var(--text)",
                background: "rgba(8,8,8,0.75)",
                backdropFilter: "blur(6px)",
                border: "1px solid var(--accent)",
              }}
            >
              Salir · Esc
            </button>

            <div
              className="absolute bottom-3 right-3 grid grid-cols-3 gap-1"
              style={{ zIndex: 6 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <CamBtn label="Rotar arriba" onClick={() => rotatePolar(-0.12)} className="col-start-2">▲</CamBtn>
              <CamBtn label="Rotar izquierda" onClick={() => rotateAzimuth(-0.2)} className="col-start-1 row-start-2">◀</CamBtn>
              <CamBtn label="Acercar" onClick={() => dolly(0.85)} className="col-start-2 row-start-2">＋</CamBtn>
              <CamBtn label="Rotar derecha" onClick={() => rotateAzimuth(0.2)} className="col-start-3 row-start-2">▶</CamBtn>
              <CamBtn label="Rotar abajo" onClick={() => rotatePolar(0.12)} className="col-start-2 row-start-3">▼</CamBtn>
              <CamBtn label="Alejar" onClick={() => dolly(1.18)} className="col-start-3 row-start-3">－</CamBtn>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 max-w-2xl mx-auto relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {selected ? (
            /* ── TECH detail ── */
            <motion.div
              key={`tech-${selected.category.name}-${selected.tech}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2"
                style={{ color: selected.category.brand }}
              >
                {selected.category.name}
              </p>
              <h4
                className="font-black uppercase tracking-tight"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                }}
              >
                {selected.tech}
              </h4>
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => setSelected(null)}
                  className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                >
                  ← {selected.category.name}
                </button>
              </div>
            </motion.div>
          ) : activeCat ? (
            /* ── CATEGORY service detail ── */
            <motion.div
              key={`cat-${activeCat.name}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2"
                style={{ color: activeCat.brand }}
              >
                {activeCat.name}
              </p>
              <h4
                className="font-black uppercase tracking-tight"
                style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)", letterSpacing: "-0.02em", color: "var(--text)" }}
              >
                {activeCat.service.headline}
              </h4>
              <p className="mt-3 text-sm text-[var(--text-dim)] leading-relaxed max-w-xl mx-auto">
                {activeCat.service.summary}
              </p>
              <ul className="mt-4 space-y-1.5 text-left max-w-md mx-auto">
                {activeCat.service.bullets.map((b) => (
                  <li key={b} className="text-sm text-[var(--text-dim)] leading-relaxed flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: activeCat.brand }} />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {activeCat.techs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelected({ category: activeCat, tech: t })}
                    className="px-2.5 py-1 text-[11px] font-medium border border-[var(--line)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFilterCategory(null)}
                className="mt-5 text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
              >
                ← Volver al resumen
              </button>
            </motion.div>
          ) : (
            /* ── OVERVIEW (always-visible summary + nav) ── */
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)] mb-4">
                Lo que hago · pulsa un área para ver más
              </p>
              <ul className="space-y-2 max-w-lg mx-auto">
                {CATEGORIES.map((c) => (
                  <li key={c.name}>
                    <button
                      onClick={() => setFilterCategory(c.name)}
                      onMouseEnter={() => setHoveredCategory(c.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="group w-full flex items-center gap-3 px-3.5 py-2.5 border border-[var(--line)] hover:border-[var(--text-dim)]/50 transition-all text-left"
                      style={{ background: "rgba(255,255,255,0.012)" }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: c.brand, boxShadow: `0 0 8px ${c.brand}` }}
                      />
                      <span className="text-sm text-[var(--text)]">{c.service.headline}</span>
                      <span
                        className="ml-auto text-[var(--text-dim)] group-hover:translate-x-0.5 transition-transform"
                        style={{ color: c.brand }}
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setManualPause((p) => !p)}
            className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-[var(--line)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-all"
          >
            {manualPause ? "▶ Reanudar" : "❚❚ Pausar"}
          </button>
          {[
            { label: "0.5×", value: 0.5 as const },
            { label: "1×", value: 1 as const },
            { label: "2×", value: 2 as const },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setSpeedMul(s.value)}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-all"
              style={{
                borderColor: speedMul === s.value ? "var(--accent)" : "var(--line)",
                color: speedMul === s.value ? "var(--accent)" : "var(--text-dim)",
                background: speedMul === s.value ? "rgba(0,255,135,0.06)" : "transparent",
              }}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => {
              setSelected(null);
              setFilterCategory(null);
              setManualPause(false);
              setSpeedMul(1);
            }}
            className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-[var(--line)] text-[var(--text-dim)] hover:text-[var(--accent-2)] hover:border-[var(--accent-2)]/40 transition-all"
          >
            ↺ Reset
          </button>
        </div>

        {/* Screen-reader / keyboard parallel control surface — visually hidden so it
            doesn't duplicate the always-on planet labels, but every tech stays
            reachable by assistive tech (selects the same as clicking a planet). */}
        <div className="sr-only">
          <h3>Explora por tecnología</h3>
          {CATEGORIES.map((c) => (
            <div key={c.name} role="group" aria-label={c.name}>
              <p>{c.name}</p>
              {c.techs.map((tech) => {
                const sel = selected?.tech === tech && selected?.category.name === c.name;
                return (
                  <button
                    key={tech}
                    onClick={() => setSelected({ category: c, tech })}
                    aria-pressed={sel}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Small square camera-control button used in the LIVE on-canvas pad.
function CamBtn({
  children,
  label,
  onClick,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-9 h-9 flex items-center justify-center text-sm leading-none transition-all ${className ?? ""}`}
      style={{
        color: "var(--text)",
        background: "rgba(8,8,8,0.72)",
        backdropFilter: "blur(6px)",
        border: "1px solid var(--line)",
      }}
    >
      {children}
    </button>
  );
}

// Suppress unused import warning for `extend` (kept for future fiber primitives)
void extend;
void useLoader;
