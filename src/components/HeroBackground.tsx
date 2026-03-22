import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const DataParticle = ({ color, position, speed }: { color: string; position: [number, number, number]; speed: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.01;
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial color={color} />
                <Edges color="#1C1C1C" threshold={15} />
            </mesh>
        </Float>
    );
};

const Edges = ({ color, threshold }: { color: string; threshold: number }) => {
    return (
        <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5), threshold]} />
            <lineBasicMaterial color={color} linewidth={2} />
        </lineSegments>
    );
};

const Scene = () => {
    const gridRef = useRef<any>(null);

    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
        }
    });

    const particles = useMemo(() => {
        const colors = ['#FBC343', '#A5D5D5', '#F4C5C5'];
        return Array.from({ length: 20 }).map((_) => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 0.5 + Math.random()
        }));
    }, []);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />
            <color attach="background" args={['#FDFBF7']} />
            
            <group ref={gridRef}>
                <Grid
                    infiniteGrid
                    fadeDistance={50}
                    fadeStrength={5}
                    cellSize={1}
                    sectionSize={5}
                    sectionColor="#1C1C1C"
                    cellColor="#1C1C1C"
                    cellThickness={1}
                    sectionThickness={2}
                />
            </group>

            {particles.map((p, i) => (
                <DataParticle key={i} {...p} />
            ))}

            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
        </>
    );
};

const HeroBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 -z-20 w-full h-full pointer-events-none opacity-40">
            <Canvas dpr={[1, 2]}>
                <Scene />
            </Canvas>
        </div>
    );
};

export default HeroBackground;
