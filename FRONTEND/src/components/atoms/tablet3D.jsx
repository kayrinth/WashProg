import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense } from "react";

const Tablet3D = ({ image }) => {
  const texture = useTexture(image);

  return (
    <mesh scale={[1.5, 1, 0.1]} position={[0, 0, 0]}>
      {/* Bagian Depan (Layar) */}
      <planeGeometry args={[2, 3]} />
      <meshStandardMaterial map={texture} />

      {/* Bagian Belakang (Casing Tablet) */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </mesh>
  );
};

const Scene = ({ image }) => (
  <Canvas camera={{ position: [0, 0, 5] }}>
    <ambientLight intensity={0.5} />
    <spotLight position={[5, 5, 5]} />
    <Suspense fallback={null}>
      <Tablet3D image={image} />
    </Suspense>
  </Canvas>
);

export default Scene;
