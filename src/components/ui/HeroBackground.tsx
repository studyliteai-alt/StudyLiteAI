import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 100, 100]} position={[2, 0, -5]}>
          <MeshDistortMaterial
            color="#7C3AED"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      
      <Float speed={3} rotationIntensity={2} floatIntensity={4}>
        <Sphere args={[0.5, 64, 64]} position={[-3, 2, -10]}>
          <MeshDistortMaterial
            color="#FFD23F"
            attach="material"
            distort={0.6}
            speed={4}
            roughness={0.1}
            metalness={0.5}
          />
        </Sphere>
      </Float>
    </>
  );
};

const ParticleField = ({ count = 2000 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7C3AED"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
};

const HeroBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-50">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <FloatingShapes />
        <ParticleField />
        
        <fog attach="fog" args={['#f8fafc', 10, 25]} />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
