import { Canvas } from '@react-three/fiber'
import { CustomPlayer } from '@/components/CharacterCreator'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

// 3D scene entry point for the character creator route.
// Renders the Fiber canvas with our avatar controls and overlay.
export default function Page () {
  return (
    <Canvas style={{ height: '90vh', width: '100%' }}>
      <Suspense fallback={null}>
        <OrbitControls minDistance={2} maxDistance={8} zoomSpeed={0.5} />
        <CustomPlayer />
      </Suspense>
    </Canvas>
  )
}
