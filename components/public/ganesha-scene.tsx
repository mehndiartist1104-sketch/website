"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment, ContactShadows, Float } from "@react-three/drei";
import { useScroll, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  uniform sampler2D uDepth;
  uniform vec2 uMouse;
  uniform float uScroll;
  void main() {
    vUv = uv;
    float depth = texture2D(uDepth, uv).r;
    vec3 pos = position;
    pos.z += (depth - 0.35) * 0.55;
    pos.x += uMouse.x * depth * 0.18;
    pos.y += uMouse.y * depth * 0.12 - uScroll * 0.12;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uColor;
  uniform sampler2D uDepth;
  uniform vec2 uMouse;
  uniform float uScroll;
  void main() {
    float depth = texture2D(uDepth, vUv).r;
    vec2 parallax = uMouse * (depth - 0.5) * 0.045;
    parallax.x += uScroll * 0.02;
    vec4 color = texture2D(uColor, vUv + parallax);
    float edge = smoothstep(0.04, 0.18, depth);
    color.a *= edge * (1.0 - uScroll * 0.35);
    if (color.a < 0.08) discard;
    gl_FragColor = color;
  }
`;

function GaneshaIdol({
  mouseX,
  mouseY,
  scroll,
}: {
  mouseX: { get: () => number };
  mouseY: { get: () => number };
  scroll: { get: () => number };
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [colorMap, depthMap] = useTexture([
    "/ganesha-statue.png",
    "/ganesha-depth.png",
  ]);

  colorMap.colorSpace = THREE.SRGBColorSpace;

  const uniforms = useMemo(
    () => ({
      uColor: { value: colorMap },
      uDepth: { value: depthMap },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
    }),
    [colorMap, depthMap]
  );

  const targetMouse = useMemo(() => new THREE.Vector2(), []);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const mx = mouseX.get();
    const my = mouseY.get();
    const s = scroll.get();
    targetMouse.set(mx, my);
    uniforms.uMouse.value.lerp(targetMouse, 1 - Math.exp(-delta * 6));
    uniforms.uScroll.value = THREE.MathUtils.damp(uniforms.uScroll.value, s, 4, delta);
    mesh.current.rotation.y = THREE.MathUtils.damp(
      mesh.current.rotation.y,
      mx * 0.45 + s * 0.85,
      3,
      delta
    );
    mesh.current.rotation.x = THREE.MathUtils.damp(
      mesh.current.rotation.x,
      -my * 0.2 + s * 0.15,
      3,
      delta
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.18}>
      <mesh ref={mesh} position={[0.05, -0.05, 0]} scale={1.08}>
        <planeGeometry args={[2.15, 2.85, 96, 128]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#f6e7c8" />
      <spotLight
        position={[2.4, 2.8, 3.2]}
        angle={0.45}
        penumbra={0.8}
        intensity={2.4}
        color="#ffd27a"
        castShadow
      />
      <pointLight position={[-1.8, 0.4, 2]} intensity={0.8} color="#c45a3a" />
    </>
  );
}

export function GaneshaScene() {
  const mouseX = useSpring(0, { stiffness: 80, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 80, damping: 20 });
  const scrollAmount = useMotionValue(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    scrollAmount.set(Math.min(latest * 2.2, 1));
  });

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 lg:pointer-events-auto lg:left-[42%] lg:right-0"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0.1, 3.1], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="h-full w-full"
      >
        <Suspense fallback={null}>
          <SceneLights />
          <Environment preset="warehouse" />
          <GaneshaIdol mouseX={mouseX} mouseY={mouseY} scroll={scrollAmount} />
          <ContactShadows
            position={[0, -1.45, 0]}
            opacity={0.28}
            scale={4}
            blur={2.4}
            far={2.2}
            color="#3a1011"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
