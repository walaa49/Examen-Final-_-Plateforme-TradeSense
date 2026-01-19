import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Floating Wireframe Icosahedron with Mouse Interaction
function DataSphere({ mousePosition }) {
    const meshRef = useRef()
    const innerRef = useRef()

    // Auto-rotation and mouse interaction
    useFrame((state) => {
        if (meshRef.current) {
            // Smooth rotation
            meshRef.current.rotation.x += 0.003
            meshRef.current.rotation.y += 0.005

            // Mouse interaction - tilt toward cursor
            if (mousePosition) {
                meshRef.current.rotation.y += (mousePosition.x * 0.5 - meshRef.current.rotation.y) * 0.05
                meshRef.current.rotation.x += (mousePosition.y * 0.5 - meshRef.current.rotation.x) * 0.05
            }

            // Gentle floating motion
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
        }

        // Counter-rotate inner sphere
        if (innerRef.current) {
            innerRef.current.rotation.x -= 0.002
            innerRef.current.rotation.y -= 0.003
        }
    })

    return (
        <group>
            {/* Main Wireframe Icosahedron */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshStandardMaterial
                    color="#00f2ff"
                    wireframe
                    emissive="#00f2ff"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Inner Glowing Sphere */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[1.2, 32, 32]} />
                <meshStandardMaterial
                    color="#0ea5e9"
                    emissive="#0ea5e9"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.2}
                    wireframe
                />
            </mesh>

            {/* Outer Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.05, 16, 100]} />
                <meshStandardMaterial
                    color="#00f2ff"
                    emissive="#00f2ff"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </group>
    )
}

// Particle Field
function ParticleField() {
    const particlesRef = useRef()

    const particlesGeometry = useMemo(() => {
        const positions = new Float32Array(2000 * 3)
        for (let i = 0; i < 2000; i++) {
            const radius = 5 + Math.random() * 10
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 2
            positions[i * 3 + 2] = radius * Math.cos(phi)
        }
        return positions
    }, [])

    useFrame(() => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y += 0.0005
        }
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={2000}
                    array={particlesGeometry}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#00f2ff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}

// Main Scene Component
export default function Hero3DScene() {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

    // Track mouse movement
    React.useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0ea5e9" />
                <spotLight position={[0, 10, 0]} intensity={0.5} color="#00f2ff" angle={0.3} penumbra={1} />

                {/* Particle Field */}
                <ParticleField />

                {/* Main 3D Object */}
                <DataSphere mousePosition={mousePosition} />
            </Canvas>
        </div>
    )
}
