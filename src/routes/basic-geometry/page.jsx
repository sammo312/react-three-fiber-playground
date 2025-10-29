import { Suspense, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'

export default function BasicGeometryExample () {
  const [position, setPosition] = useState([0, 0, 0])
  const [hovered, setHovered] = useState(false)
  const [color, setColor] = useState('#38bdf8')
  console.log(position)
  //#1 Let's get the cube spinning with React Three Fiber's useFrame hook
  // We'll setup our ref with React's useRef
  // Reminder: useRef is a React Hook that lets you reference a value that’s not needed for rendering.
  //  const cube = useRef()

  //#3 Now we can use the useFrame hook to update our cube's rotation on each frame
  //Reminder: This hook allows you to execute code on every rendered frame, like running effects, updating controls, and so on.
  // useFrame((_, delta) => {
  //   if (!cube.current) return
  //   cube.current.rotation.y += delta
  //   cube.current.rotation.x += delta * 0.6
  // })

  return (
    <Canvas>
      <Suspense>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} />

        <mesh
          // #0 let's render a box! Can adjust rotation here for fun
          // perform some transform live on the mesh
          //
          rotation={[0.2, 10, 2]}
          onPointerOver={event => {
            event.stopPropagation()
            setColor('#f87171')
          }}
          onPointerOut={() => setColor('#38bdf8')}
          // position={position}
          // #2 Let's put the ref on the mesh to reference it
          //ref={cube}
        >
          {/* #0 can adjust args here for fun */}
          <boxGeometry args={[2, 2, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* #3 let's add some html -- positioned within the 3d scene */}
        {/* <Html center
       position={[0, -1.25, 0]} //here we can control the position in 3d space / try adding our position State!
        distanceFactor={6}>
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(17,24,39,0.88)',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.75rem',
            fontSize: '0.75rem',
            color: '#e2e8f0',
            boxShadow: '0 12px 30px rgba(15,23,42,0.35)'
          }}
        >
          Docked label: anchored to the mesh position with screen-facing HTML.
        </div>
      </Html> */}
        {/* #3 let's add some html -- fixed outside the 3d scene */}

        {/* <Html
        fullscreen //This is what makes it fixed
      >
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '2rem'
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              maxWidth: '18rem',
              background: 'rgba(15,23,42,0.85)',
              padding: '1.25rem',
              borderRadius: '1rem',
              fontSize: '0.85rem',
              lineHeight: 1.4,
              color: '#f8fafc',
              boxShadow: '0 20px 45px rgba(8,15,35,0.55)'
            }}
          >
            <button
              style={{ background: 'red' }}
              onClick={() => {
                setPosition([position[0], position[1]+1, position[2]])
              }}
            >
              Click Me
            </button>

            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              Fullscreen overlay
            </p>
            <p>
              This panel uses <code>Html fullscreen</code> so positioning is
              pure CSS. Use it for instructions, HUDs, or responsive layouts
              that shouldn&apos;t track a mesh.
            </p>
          </div>
        </div>
      </Html> */}
      </Suspense>
    </Canvas>
  )
}
