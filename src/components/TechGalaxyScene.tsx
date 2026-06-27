"use client";

import React, { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader, extend, ThreeEvent } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
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
    vec3 p = vec3(vUv * 8.0, uTime * 0.08);
    float n = fbm(p);
    float n2 = fbm(p * 2.0 + vec3(uTime * 0.15));
    float surface = n * 0.6 + n2 * 0.4;

    // Color ramp: deep red → orange → yellow → white-hot
    vec3 c1 = vec3(0.42, 0.06, 0.02); // dark red
    vec3 c2 = vec3(0.92, 0.30, 0.05); // red-orange
    vec3 c3 = vec3(1.00, 0.65, 0.20); // orange
    vec3 c4 = vec3(1.00, 0.93, 0.70); // yellow-white
    vec3 c5 = vec3(1.00, 1.00, 0.98); // white-hot

    float t = surface * 0.5 + 0.5;
    vec3 col;
    if (t < 0.25)      col = mix(c1, c2, t * 4.0);
    else if (t < 0.5)  col = mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) col = mix(c3, c4, (t - 0.5) * 4.0);
    else               col = mix(c4, c5, (t - 0.75) * 4.0);

    // Limb darkening (edge fade for sphere look)
    float rim = pow(max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 0.55);
    col = mix(col * 0.55, col, rim);

    // Boost emission for bloom
    col *= 1.6;

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
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#ff7020" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Outer corona */}
      <mesh>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshBasicMaterial color="#ff4010" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Point light from sun */}
      <pointLight color="#ffb060" intensity={4.5} distance={60} decay={1.4} />
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
}: {
  category: Category;
  tech: string;
  index: number;
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  paused: boolean;
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
      angleRef.current += state.clock.getDelta() * 0 + category.speed * 0.016 * dir;
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
    <group ref={groupRef}>
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
      {isSelected && (
        <Html center distanceFactor={10} position={[0, planetSize + 0.6, 0]} style={{ pointerEvents: "none" }}>
          <div
            className="px-2.5 py-1 whitespace-nowrap text-[10px] font-mono uppercase tracking-widest"
            style={{
              background: "rgba(8,8,8,0.85)",
              border: `1px solid ${category.brand}`,
              color: category.brand,
              borderRadius: 2,
              boxShadow: `0 0 12px ${category.brand}66`,
            }}
          >
            {tech}
          </div>
        </Html>
      )}
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

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.elapsedTime * 0.003;
    }
  });

  // Build a procedural nebula texture in a shader on a big plane behind everything
  return (
    <mesh ref={meshRef} position={[0, 0, -40]} scale={[120, 120, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          // simplex noise
          vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 6; i++) {
              v += a * snoise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }
          void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            float d = length(uv);
            float n1 = fbm(vUv * 3.5 + vec2(11.0, 7.0));
            float n2 = fbm(vUv * 6.0 - vec2(5.0));
            // Color clouds: red/orange/purple/teal
            vec3 red    = vec3(0.85, 0.18, 0.10) * smoothstep(-0.2, 0.7, n1);
            vec3 purple = vec3(0.55, 0.10, 0.65) * smoothstep(-0.1, 0.5, n2);
            vec3 orange = vec3(0.95, 0.42, 0.10) * smoothstep(0.1, 0.6, fbm(vUv * 4.0 - vec2(20.0)));
            vec3 teal   = vec3(0.10, 0.55, 0.65) * smoothstep(0.2, 0.6, fbm(vUv * 5.0 + vec2(30.0)));
            vec3 col = red * 0.55 + purple * 0.4 + orange * 0.35 + teal * 0.2;
            // Darken edges (vignette) + center dim so sun doesn't get washed out
            float vign = 1.0 - smoothstep(0.4, 1.4, d);
            col *= vign * 0.7;
            // Hold dim near center (sun area)
            col *= smoothstep(0.0, 0.4, d);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── SCENE ─────────────────────────────────────────────────────────────────

function Scene({
  selected,
  setSelected,
  hoveredCategory,
}: {
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  hoveredCategory: string | null;
}) {
  const paused = selected !== null;

  return (
    <>
      <ambientLight intensity={0.15} />
      <Nebula />
      <Stars radius={100} depth={50} count={4500} factor={3.5} saturation={0} fade speed={0.5} />
      <SunMesh />

      {CATEGORIES.map((c) => {
        const active = selected?.category.name === c.name || hoveredCategory === c.name;
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
              />
            ))}
          </group>
        );
      })}
    </>
  );
}

// ─── PUBLIC COMPONENT ──────────────────────────────────────────────────────

export default function TechGalaxyScene() {
  const [selected, setSelected] = useState<SelectedState>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-square max-w-[820px] mx-auto"
        style={{ background: "radial-gradient(ellipse at center, #060818 0%, #020308 70%, #000 100%)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        <Canvas
          camera={{ position: [0, 9, 22], fov: 55, near: 0.1, far: 200 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#020308"]} />
          <Suspense fallback={null}>
            <Scene selected={selected} setSelected={setSelected} hoveredCategory={hoveredCategory} />
            <EffectComposer>
              <Bloom
                intensity={1.4}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.3}
                kernelSize={KernelSize.LARGE}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
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
              ◆ Pulsa un planeta para explorar mi stack
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onMouseEnter={() => setHoveredCategory(c.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-opacity"
              style={{
                color: c.brand,
                opacity:
                  hoveredCategory && hoveredCategory !== c.name ? 0.35 : 1,
              }}
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
          ))}
        </div>
      </div>
    </div>
  );
}

// Suppress unused import warning for `extend` (kept for future fiber primitives)
void extend;
void useLoader;
