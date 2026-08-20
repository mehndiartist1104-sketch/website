"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import { useScroll, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function KeyedPlate({
  mapUrl,
  aspect,
  opacityRef,
}: {
  mapUrl: string;
  aspect: number;
  opacityRef: { current: number };
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const colorMap = useTexture(mapUrl);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.anisotropy = 8;

  const uniforms = useMemo(
    () => ({
      uMap: { value: colorMap },
      uOpacity: { value: 1 },
    }),
    [colorMap]
  );

  useFrame(() => {
    if (mat.current) mat.current.uniforms.uOpacity.value = opacityRef.current;
  });

  return (
    <mesh scale={[aspect, 1, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uMap;
          uniform float uOpacity;
          void main() {
            vec4 color = texture2D(uMap, vUv);
            float m = max(color.r, max(color.g, color.b));
            float alpha = smoothstep(0.02, 0.07, m) * uOpacity;
            if (alpha < 0.06) discard;
            gl_FragColor = vec4(color.rgb, alpha);
          }
        `}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function BridalScene({
  scroll,
  mouseX,
  mouseY,
}: {
  scroll: { get: () => number };
  mouseX: { get: () => number };
  mouseY: { get: () => number };
}) {
  const { camera, viewport } = useThree();
  const figure = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const presenting = useRef<THREE.Group>(null);
  const figureOpacity = useRef(1);
  const handOpacity = useRef(0);
  const presentOpacity = useRef(0);
  const mobile = viewport.width < 5.2;

  useFrame((_, delta) => {
    const t = scroll.get();
    const mx = mouseX.get();
    const my = mouseY.get();

    const reveal = THREE.MathUtils.smoothstep(t, 0.16, 0.52);
    const showcase = THREE.MathUtils.smoothstep(t, 0.42, 0.88);
    const finale = THREE.MathUtils.smoothstep(t, 0.58, 1);

    const camX = THREE.MathUtils.lerp(mobile ? 0.04 : 0.38, 0, showcase) + mx * 0.16;
    const camY =
      THREE.MathUtils.lerp(0.4, THREE.MathUtils.lerp(0.06, -0.52, finale), reveal) + my * 0.07;
    const camZ = THREE.MathUtils.lerp(2.5, THREE.MathUtils.lerp(3.85, 2.1, finale), reveal);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 3.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 3.2, delta);
    camera.lookAt(mx * 0.1, THREE.MathUtils.lerp(0.36, -0.46, showcase), 0);

    if (figure.current) {
      const fx = mobile ? 0.02 : 0.52;
      figure.current.position.x = THREE.MathUtils.damp(
        figure.current.position.x,
        fx + mx * 0.05,
        4,
        delta
      );
      figure.current.position.y = THREE.MathUtils.damp(
        figure.current.position.y,
        -0.12 - t * 0.32,
        4,
        delta
      );
      figure.current.position.z = THREE.MathUtils.damp(
        figure.current.position.z,
        -0.15 - showcase * 0.85,
        4,
        delta
      );
      const fs = mobile ? 1.7 : 2.05;
      figure.current.scale.setScalar(THREE.MathUtils.damp(figure.current.scale.x, fs, 4, delta));
      figure.current.rotation.y = THREE.MathUtils.damp(
        figure.current.rotation.y,
        mx * 0.1 + t * 0.06,
        4,
        delta
      );
    }
    figureOpacity.current = THREE.MathUtils.damp(figureOpacity.current, 1, 5, delta);

    const handY = THREE.MathUtils.lerp(-0.52, -0.4, showcase);
    const handZ = THREE.MathUtils.lerp(0.15, 1.32, showcase);
    const spread = THREE.MathUtils.lerp(0.2, mobile ? 0.7 : 1.1, showcase);

    if (left.current) {
      left.current.position.x = THREE.MathUtils.damp(left.current.position.x, -spread, 3.4, delta);
      left.current.position.y = THREE.MathUtils.damp(left.current.position.y, handY + 0.05, 3.4, delta);
      left.current.position.z = THREE.MathUtils.damp(left.current.position.z, handZ, 3.4, delta);
      left.current.scale.setScalar(
        THREE.MathUtils.damp(
          left.current.scale.x,
          THREE.MathUtils.lerp(0.2, mobile ? 0.92 : 1.12, showcase),
          3.4,
          delta
        )
      );
      left.current.rotation.y = THREE.MathUtils.damp(left.current.rotation.y, 0.2 + mx * 0.08, 4, delta);
      left.current.rotation.z = THREE.MathUtils.damp(left.current.rotation.z, 0.16, 4, delta);
    }

    if (right.current) {
      right.current.position.x = THREE.MathUtils.damp(right.current.position.x, spread, 3.4, delta);
      right.current.position.y = THREE.MathUtils.damp(right.current.position.y, handY, 3.4, delta);
      right.current.position.z = THREE.MathUtils.damp(
        right.current.position.z,
        handZ + 0.04,
        3.4,
        delta
      );
      right.current.scale.setScalar(
        THREE.MathUtils.damp(
          right.current.scale.x,
          THREE.MathUtils.lerp(0.2, mobile ? 0.92 : 1.12, showcase),
          3.4,
          delta
        )
      );
      right.current.rotation.y = THREE.MathUtils.damp(
        right.current.rotation.y,
        -0.2 + mx * 0.08,
        4,
        delta
      );
      right.current.rotation.z = THREE.MathUtils.damp(right.current.rotation.z, -0.14, 4, delta);
    }
    handOpacity.current = THREE.MathUtils.damp(handOpacity.current, 0.35 + reveal * 0.65, 5, delta);

    if (presenting.current) {
      presenting.current.position.y = THREE.MathUtils.damp(
        presenting.current.position.y,
        -0.38,
        4,
        delta
      );
      presenting.current.position.z = THREE.MathUtils.damp(
        presenting.current.position.z,
        1.48,
        4,
        delta
      );
      presenting.current.scale.setScalar(
        THREE.MathUtils.damp(
          presenting.current.scale.x,
          THREE.MathUtils.lerp(0.15, mobile ? 1.45 : 1.78, finale),
          3.2,
          delta
        )
      );
      presenting.current.rotation.y = THREE.MathUtils.damp(
        presenting.current.rotation.y,
        mx * 0.07,
        4,
        delta
      );
    }
    presentOpacity.current = THREE.MathUtils.damp(presentOpacity.current, finale, 5, delta);
  });

  return (
    <>
      <ambientLight intensity={0.85} color="#fff4e0" />
      <spotLight
        position={[3.2, 2.6, 4]}
        angle={0.5}
        penumbra={0.85}
        intensity={2.6}
        color="#ffd27a"
      />
      <pointLight position={[-2.4, 0.6, 2.2]} intensity={0.85} color="#c45a3a" />
      <pointLight position={[0, -1.4, 2.8]} intensity={0.5} color="#e8c56b" />
      <Sparkles count={42} scale={[7, 5, 4]} size={2.3} speed={0.26} opacity={0.5} color="#c9a227" />

      <group ref={figure}>
        <KeyedPlate mapUrl="/bride-figure.png" aspect={3 / 4} opacityRef={figureOpacity} />
      </group>
      <group ref={left}>
        <KeyedPlate mapUrl="/bride-hand-left.png" aspect={1} opacityRef={handOpacity} />
      </group>
      <group ref={right}>
        <KeyedPlate mapUrl="/bride-hand-right.png" aspect={1} opacityRef={handOpacity} />
      </group>
      <group ref={presenting}>
        <KeyedPlate mapUrl="/bride-hands.png" aspect={16 / 9} opacityRef={presentOpacity} />
      </group>
    </>
  );
}

export function BrideBackground() {
  const mouseX = useSpring(0, { stiffness: 70, damping: 22 });
  const mouseY = useSpring(0, { stiffness: 70, damping: 22 });
  const scrollAmount = useMotionValue(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollAmount.set(max > 0 ? Math.min(latest / max, 1) : 0);
  });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouseX.set(event.clientX / window.innerWidth - 0.5);
      mouseY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0.38, 0.4, 2.5], fov: 34, near: 0.1, far: 20 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="h-full w-full"
      >
        <color attach="background" args={["#2a0e10"]} />
        <Suspense fallback={null}>
          <BridalScene scroll={scrollAmount} mouseX={mouseX} mouseY={mouseY} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/55 via-primary/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20" />
    </div>
  );
}
