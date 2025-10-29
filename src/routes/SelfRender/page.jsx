import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'

const REMOTE_MODEL_URL = 'https://0vby8hfrza.ufs.sh/f/56b21a2a-a83a-403a-9ff9-40294b033e65-dgddye.glb'

function RemoteModel ({ url }) {
  const gltf = useGLTF(url, true)
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  return <primitive object={scene} dispose={null} />
}

useGLTF.preload(REMOTE_MODEL_URL)

export default function Page () {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#050505' }}>
      <Canvas camera={{ position: [2, 2, 4], fov: 45 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <RemoteModel url={REMOTE_MODEL_URL} />
          <Environment preset='studio' />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  )
}
