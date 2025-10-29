import React from 'react'
import { useGLTF } from '@react-three/drei'

const withHandlers = (part, handleHovered, clearHovered, handleSelected, colors) => ({
  onPointerMove: (event) => handleHovered(part, event.clientX, event.clientY),
  onPointerOut: clearHovered,
  onClick: (event) => handleSelected(part, event.clientX, event.clientY),
  'material-color': colors[part] ?? '#ffffff',
  castShadow: true,
  receiveShadow: true
})

const SEGMENTS = [
  { key: 'hair', node: 'woman_1' },
  { key: 'skin', node: 'woman_2' },
  { key: 'torso', node: 'woman_3' },
  { key: 'legs', node: 'woman_4' },
  { key: 'eye1', node: 'woman_5' },
  { key: 'eye2', node: 'woman_6' },
  { key: 'eye3', node: 'woman_7' },
  { key: 'teeth1', node: 'woman_8' },
  { key: 'teeth2', node: 'woman_9' },
  { key: 'teeth3', node: 'woman_10' }
]

export function BodyType2 ({ handleSelected, handleHovered, clearHovered, colors, ...groupProps }) {
  const { nodes } = useGLTF('/bodytype2.glb')

  return (
    <group {...groupProps} dispose={null}>
      {SEGMENTS.map(({ key, node }) => {
        const geometry = nodes[node]?.geometry
        if (!geometry) return null
        return (
          <mesh
            key={key}
            {...withHandlers(key, handleHovered, clearHovered, handleSelected, colors)}
            geometry={geometry}
          />
        )
      })}
    </group>
  )
}

useGLTF.preload('/bodytype2.glb')
