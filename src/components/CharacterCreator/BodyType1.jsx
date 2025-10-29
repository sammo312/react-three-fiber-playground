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

export function BodyType1 ({ handleSelected, handleHovered, clearHovered, colors, ...groupProps }) {
  const { nodes } = useGLTF('/bodytype1.glb')

  return (
    <group {...groupProps} dispose={null}>
      <mesh {...withHandlers('hair', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_1.geometry} />
      <mesh {...withHandlers('skin', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_2.geometry} />
      <mesh {...withHandlers('torso', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_3.geometry} />
      <mesh {...withHandlers('legs', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_4.geometry} />
      <mesh {...withHandlers('eye1', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_5.geometry} />
      <mesh {...withHandlers('eye2', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_6.geometry} />
      <mesh {...withHandlers('eye3', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_7.geometry} />
      <mesh {...withHandlers('teeth1', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_8.geometry} />
      <mesh {...withHandlers('teeth2', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_9.geometry} />
      <mesh {...withHandlers('teeth3', handleHovered, clearHovered, handleSelected, colors)} geometry={nodes.man_10.geometry} />
    </group>
  )
}

useGLTF.preload('/bodytype1.glb')
