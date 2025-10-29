import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Sparkles } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

const COLORS = ['#ff7f7f', '#7fff7f', '#7f7fff', '#ffd27f', '#7ffff0', '#f07fff']
const GEOMETRIES = [
  { type: 'dodecahedron', args: [0.6, 0] },
  { type: 'icosahedron', args: [0.7, 0] },
  { type: 'octahedron', args: [0.55, 0] },
  { type: 'torus', args: [0.6, 0.24, 24, 48] },
  { type: 'box', args: [0.9, 0.9, 0.9] }
]

function randomInRange (min, max) {
  return min + Math.random() * (max - min)
}

function FloatingThing ({ basePosition, baseRotation, baseColor }) {
  const meshRef = useRef()
  const [color, setColor] = useState(baseColor)
  const geometryChoice = useMemo(
    () => GEOMETRIES[Math.floor(Math.random() * GEOMETRIES.length)],
    []
  )

  const randomFactor = useMemo(() => ({
    speed: randomInRange(0.2, 0.6),
    wobble: randomInRange(0.5, 1.2),
    sway: randomInRange(0.4, 1),
    offset: Math.random() * Math.PI * 2
  }), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * randomFactor.speed + randomFactor.offset
    meshRef.current.position.set(
      basePosition[0] + Math.sin(t) * randomFactor.wobble,
      basePosition[1] + Math.cos(t * 0.9) * randomFactor.sway,
      basePosition[2] + Math.sin(t * 0.7) * randomFactor.wobble
    )
    meshRef.current.rotation.x = baseRotation[0] + Math.sin(t * 0.6) * 0.4
    meshRef.current.rotation.y = baseRotation[1] + Math.cos(t * 0.4) * 0.4
    meshRef.current.rotation.z = baseRotation[2] + Math.sin(t * 0.8) * 0.4
  })

  const cycleColor = () => {
    setColor(prev => {
      const nextIndex = (COLORS.indexOf(prev) + 1) % COLORS.length
      return COLORS[nextIndex]
    })
  }

  return (
    <mesh
      ref={meshRef}
      onPointerDown={cycleColor}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {geometryChoice.type === 'dodecahedron' && <dodecahedronGeometry args={geometryChoice.args} />}
      {geometryChoice.type === 'icosahedron' && <icosahedronGeometry args={geometryChoice.args} />}
      {geometryChoice.type === 'octahedron' && <octahedronGeometry args={geometryChoice.args} />}
      {geometryChoice.type === 'torus' && <torusGeometry args={geometryChoice.args} />}
      {geometryChoice.type === 'box' && <boxGeometry args={geometryChoice.args} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  )
}

function FloatingGroup () {
  const things = useMemo(() => {
    const items = []
    for (let i = 0; i < 20; i += 1) {
      items.push({
        key: `thing-${i}`,
        position: [
          randomInRange(-6, 6),
          randomInRange(-4, 4),
          randomInRange(-6, 6)
        ],
        rotation: [
          randomInRange(0, Math.PI * 2),
          randomInRange(0, Math.PI * 2),
          randomInRange(0, Math.PI * 2)
        ],
        color: COLORS[i % COLORS.length]
      })
    }
    return items
  }, [])

  return (
    <group>
      {things.map(item => (
        <FloatingThing
          key={item.key}
          basePosition={item.position}
          baseRotation={item.rotation}
          baseColor={item.color}
        />
      ))}
    </group>
  )
}

function CameraRig () {
  const { camera, mouse } = useThree()
  const target = useMemo(() => ({ x: 0, y: 1.5, z: 9 }), [])

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.pow(0.03, delta)
    const desiredX = target.x + mouse.x * 1.5
    const desiredY = target.y + mouse.y * 1.2

    camera.position.x += (desiredX - camera.position.x) * lerpFactor
    camera.position.y += (desiredY - camera.position.y) * lerpFactor
    camera.lookAt(0, 0, 0)
  })

  return null
}

function SceneLighting () {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 6, 4]} intensity={1.4} color='#ffd6a5' />
      <pointLight position={[-6, -4, -4]} intensity={0.9} color='#9bf6ff' />
      <hemisphereLight intensity={0.6} groundColor='#0a0021' />
    </>
  )
}

export default function Page () {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 9], fov: 45 }}
      style={{ width: '100%', height: '100vh' }}
      gl={{ antialias: true }}
    >
      <color attach='background' args={['white']} />
      <fog attach='fog' args={['#050314', 12, 26]} />
      <Suspense fallback={null}>
        <SceneLighting />
        <Sparkles count={120} scale={[12, 8, 12]} size={4} speed={0.2} color='black' />
        <Html
          fullscreen
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '3rem 4rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              pointerEvents: 'none'
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'black'
                }}
              >
                Playground
              </span>
              <h1
                style={{
                  margin: '0.4rem 0 0',
                  fontSize: '3.5rem',
                  letterSpacing: '-0.02em',
                  color: 'black'
                }}
              >
                React Three Fiber 
              </h1>
            </div>
          
          </div>
        </Html>
        <FloatingGroup />
        <CameraRig />
        <OrbitControls enableZoom enablePan enableRotate />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.25} intensity={1.2} />
          <ChromaticAberration offset={[0.0008, 0.0002]} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
