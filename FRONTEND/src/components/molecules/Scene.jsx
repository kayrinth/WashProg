import { useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

const MenuBoard = () => {
  const groupRef = useRef();
  const texture = useLoader(TextureLoader, "/Menu.JPG");

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  const { viewport } = useThree();
  const scaleFactor = Math.min(viewport.width / 28, 1);

  return (
    // untuk menghindari peringatan eslint
    /* eslint-disable */
    <group ref={groupRef} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[23, 40.5, 0.2]} />
        <meshStandardMaterial
          color="#000"
          metalness={1}
          roughness={0.1}
          emissive={"#222"}
          emissiveIntensity={0.8}
        />
      </mesh>

      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[22.5, 40]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 50], fov: 50 }}
      suppressHydrationWarning
    >
      <ambientLight intensity={2} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      <MenuBoard />
      <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
    </Canvas>
  );
};

export default Scene;
