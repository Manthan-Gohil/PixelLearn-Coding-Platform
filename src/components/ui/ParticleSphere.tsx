"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function DotSphere() {
    const meshRef = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    const count = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Fibonacci sphere distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const r = 2.5;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    const sizes = useMemo(() => {
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            s[i] = Math.random() * 2 + 1;
        }
        return s;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Gentle auto-rotation
        meshRef.current.rotation.y = t * 0.08;
        meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.15;

        // Mouse influence
        const pointer = state.pointer;
        mouseRef.current.x += (pointer.x * 0.15 - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (pointer.y * 0.15 - mouseRef.current.y) * 0.05;
        meshRef.current.rotation.y += mouseRef.current.x;
        meshRef.current.rotation.x += mouseRef.current.y;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                color="#E6C212"
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function ParticleSphere() {
    return (
        <div className="absolute inset-0 z-0 opacity-70" style={{ pointerEvents: "none" }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                style={{ pointerEvents: "none" }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 1.5]}
            >
                <DotSphere />
            </Canvas>
        </div>
    );
}
