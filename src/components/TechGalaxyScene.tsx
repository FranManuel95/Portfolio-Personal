"use client";

import React, { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader, extend, ThreeEvent } from "@react-three/fiber";
import { Stars, Html, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

// ─── DATA ────────────────────────────────────────────────────────────────────

type CategoryName =
  | "IA & Agentes"
  | "Automatización"
  | "Frontend"
  | "Backend & BD"
  | "Infra & DevOps";

type SurfaceType = "plasma" | "lava" | "earth" | "gas" | "rocky";

type Category = {
  name: CategoryName;
  brand: string;
  baseColor: string;
  accentColor: string;
  surface: SurfaceType;
  radius: number;
  speed: number; // angular speed (rad/sec)
  techs: string[];
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
  },
];

const RINGED_TECHS = new Set(["Pinecone", "Postgres", "Docker", "n8n"]);
const PLANET_RADIUS = 0.55;

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
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFrag = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uShadow;
  uniform int uSurface;       // 0 plasma 1 lava 2 earth 3 gas 4 rocky
  uniform vec3 uLightDir;     // direction TO sun in world space
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

  void main() {
    vec3 n = normalize(vNormal);
    vec3 sp = normalize(vWorldPos);
    vec3 surfaceCol;

    if (uSurface == 0) {
      // PLASMA — ionized swirling glow
      float v = fbm(sp * 3.0 + vec3(uTime * 0.2));
      float v2 = fbm(sp * 6.0 - vec3(uTime * 0.13));
      float val = v * 0.6 + v2 * 0.4;
      surfaceCol = mix(uShadow, uBase, val * 0.5 + 0.5);
      surfaceCol = mix(surfaceCol, uAccent, smoothstep(0.4, 0.8, val));
    } else if (uSurface == 1) {
      // LAVA — hot cracked surface
      float crack = fbm(sp * 4.5);
      float hot = smoothstep(0.0, 0.3, crack);
      surfaceCol = mix(uShadow, uBase, hot);
      surfaceCol = mix(surfaceCol, uAccent * 1.3, smoothstep(0.35, 0.55, crack));
    } else if (uSurface == 2) {
      // EARTH-LIKE — continents + clouds
      float land = fbm(sp * 2.5);
      float clouds = fbm(sp * 4.0 + vec3(uTime * 0.04));
      vec3 ocean = uShadow;
      vec3 continent = mix(uBase, vec3(0.4, 0.6, 0.25), 0.5);
      surfaceCol = mix(ocean, continent, smoothstep(0.0, 0.15, land));
      // ice caps
      surfaceCol = mix(surfaceCol, vec3(0.95), smoothstep(0.75, 0.95, abs(sp.y)));
      // clouds
      surfaceCol = mix(surfaceCol, vec3(1.0), smoothstep(0.35, 0.55, clouds) * 0.6);
    } else if (uSurface == 3) {
      // GAS GIANT — horizontal bands
      float bands = sin(sp.y * 14.0 + fbm(sp * 2.0) * 2.5) * 0.5 + 0.5;
      float turbulence = fbm(sp * 3.0 + vec3(uTime * 0.05));
      surfaceCol = mix(uShadow, uBase, bands);
      surfaceCol = mix(surfaceCol, uAccent, smoothstep(0.6, 1.0, bands + turbulence * 0.3));
    } else {
      // ROCKY — cratered matte
      float rock = fbm(sp * 5.0);
      float crater = fbm(sp * 12.0);
      surfaceCol = mix(uShadow, uBase, rock * 0.5 + 0.5);
      surfaceCol = mix(surfaceCol, vec3(0.1), smoothstep(0.5, 0.55, crater) * 0.5);
    }

    // Lighting from sun
    float diff = max(0.0, dot(n, uLightDir));
    float ambient = 0.18;
    vec3 lit = surfaceCol * (ambient + diff * 1.2);

    // Rim/atmosphere glow
    float rim = 1.0 - max(0.0, dot(n, vec3(0.0, 0.0, 1.0)));
    rim = pow(rim, 2.5);
    lit += uBase * rim * 0.4;

    // Selected: boost
    if (uSelected > 0.5) {
      lit += uAccent * 0.25;
    }

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
}: {
  category: Category;
  tech: string;
  index: number;
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  paused: boolean;
  speedMul: number;
  dimmed: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const angleRef = useRef((index / category.techs.length) * Math.PI * 2);
  const isSelected = selected?.category.name === category.name && selected.tech === tech;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBase: { value: new THREE.Color(category.baseColor) },
      uAccent: { value: new THREE.Color(category.accentColor) },
      uShadow: { value: new THREE.Color(category.brand).multiplyScalar(0.1) },
      uSurface: { value: surfaceTypeIndex(category.surface) },
      uLightDir: { value: new THREE.Vector3(0, 0, 0) },
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
      (matRef.current.uniforms.uTime as { value: number }).value = state.clock.elapsedTime;
      const ld = new THREE.Vector3(-x, 0, -z).normalize();
      (matRef.current.uniforms.uLightDir as { value: THREE.Vector3 }).value = ld;
      (matRef.current.uniforms.uSelected as { value: number }).value = isSelected ? 1 : 0;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelected({ category, tech });
  };

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  const hasRing = RINGED_TECHS.has(tech);
  const planetSize = PLANET_RADIUS * (isSelected ? 1.35 : 1);

  return (
    <group ref={groupRef} scale={dimmed ? 0.6 : 1} visible>
      <mesh ref={meshRef} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <sphereGeometry args={[planetSize, 48, 48]} />
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
      <Html center distanceFactor={14} position={[0, planetSize + 0.55, 0]} style={{ pointerEvents: "none" }} zIndexRange={[0, 0]}>
        <div
          className="whitespace-nowrap font-mono uppercase select-none"
          style={{
            fontSize: isSelected ? "12px" : "9px",
            letterSpacing: isSelected ? "0.2em" : "0.15em",
            padding: isSelected ? "3px 8px" : "2px 6px",
            background: isSelected ? "rgba(8,8,8,0.9)" : "rgba(8,8,8,0.55)",
            border: `1px solid ${category.brand}${isSelected ? "" : "55"}`,
            color: category.brand,
            opacity: dimmed ? 0.15 : isSelected ? 1 : 0.85,
            textShadow: `0 0 6px ${category.brand}88`,
            transition: "all 0.25s ease",
          }}
        >
          {tech}
        </div>
      </Html>
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
}: {
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  hoveredCategory: string | null;
  filterCategory: string | null;
  manualPause: boolean;
  speedMul: number;
}) {
  const paused = manualPause || selected !== null;

  return (
    <>
      <ambientLight intensity={0.15} />
      <PaintedNebulae />
      <Stars radius={100} depth={50} count={5500} factor={3.5} saturation={0} fade speed={0.5} />
      <ColoredStars />
      <SunMesh />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enableZoom
        enablePan={false}
        minDistance={14}
        maxDistance={42}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.62}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
      />

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
              />
            ))}
          </group>
        );
      })}
    </>
  );
}

// ─── SHOOTING STARS (2D overlay) ───────────────────────────────────────────

function ShootingStars() {
  const [stars, setStars] = useState<
    { id: number; from: { x: number; y: number }; angle: number; length: number; thickness: number }[]
  >([]);

  React.useEffect(() => {
    let id = 0;
    const spawn = () => {
      const fromTop = Math.random() < 0.7;
      const from = fromTop
        ? { x: 10 + Math.random() * 80, y: -10 }
        : { x: -10, y: 5 + Math.random() * 50 };
      const angle = fromTop ? 35 + Math.random() * 30 : 15 + Math.random() * 25;
      const length = 180 + Math.random() * 140;
      const thickness = 1 + Math.random() * 1.5;
      const newId = ++id;
      setStars((s) => [...s, { id: newId, from, angle, length, thickness }]);
      setTimeout(() => setStars((s) => s.filter((x) => x.id !== newId)), 3800);
    };
    const interval = setInterval(spawn, 4500 + Math.random() * 5000);
    setTimeout(spawn, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {stars.map((s) => {
          const dx = Math.cos((s.angle * Math.PI) / 180) * 140;
          const dy = Math.sin((s.angle * Math.PI) / 180) * 140;
          return (
            <motion.div
              key={s.id}
              className="absolute"
              initial={{ left: `${s.from.x}%`, top: `${s.from.y}%`, opacity: 0 }}
              animate={{
                left: `${s.from.x + dx}%`,
                top: `${s.from.y + dy}%`,
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 3.4, ease: "easeOut", times: [0, 0.08, 0.85, 1] }}
              style={{ transform: `rotate(${s.angle}deg)` }}
            >
              <div
                style={{
                  width: s.length,
                  height: s.thickness,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,240,210,0.4) 30%, rgba(255,255,255,1) 100%)",
                  borderRadius: 999,
                  boxShadow:
                    "0 0 6px rgba(255,255,255,0.8), 0 0 14px rgba(255,220,150,0.5)",
                  transform: "translateX(-100%)",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ─── PUBLIC COMPONENT ──────────────────────────────────────────────────────

export default function TechGalaxyScene() {
  const [selected, setSelected] = useState<SelectedState>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [manualPause, setManualPause] = useState(false);
  const [speedMul, setSpeedMul] = useState<0.5 | 1 | 2>(1);

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-square max-w-[820px] mx-auto"
        style={{ background: "var(--bg)" }}
      >
        {/* Soft vignette — fades canvas edges into project background so the box is invisible */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(8,8,8,0.5) 85%, var(--bg) 100%)",
            zIndex: 5,
          }}
        />
        <Canvas
          camera={{ position: [0, 3.2, 27], fov: 52, near: 0.1, far: 200 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#080808"]} />
          <Suspense fallback={null}>
            <Scene
              selected={selected}
              setSelected={setSelected}
              hoveredCategory={hoveredCategory}
              filterCategory={filterCategory}
              manualPause={manualPause}
              speedMul={speedMul}
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
        <ShootingStars />
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={`${selected.category.name}-${selected.tech}`}
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
              <button
                onClick={() => setSelected(null)}
                className="mt-4 text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
              >
                × Cerrar · Reanudar órbitas
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)]"
            >
              ◆ Arrastra para rotar · Scroll para zoom · Pulsa un planeta
            </motion.p>
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

        {/* Category filter legend — click to isolate */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {CATEGORIES.map((c) => {
            const active = filterCategory === c.name;
            const otherActive = filterCategory !== null && filterCategory !== c.name;
            return (
              <button
                key={c.name}
                onMouseEnter={() => setHoveredCategory(c.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => setFilterCategory(active ? null : c.name)}
                className="flex items-center gap-2 px-2 py-1 text-[10px] font-mono uppercase tracking-widest transition-all border"
                style={{
                  color: c.brand,
                  borderColor: active ? c.brand : "transparent",
                  background: active ? `${c.brand}10` : "transparent",
                  opacity: otherActive ? 0.3 : 1,
                }}
                title={active ? "Mostrar todas" : "Aislar esta categoría"}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: c.brand,
                    boxShadow: `0 0 8px ${c.brand}`,
                  }}
                />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Suppress unused import warning for `extend` (kept for future fiber primitives)
void extend;
void useLoader;
