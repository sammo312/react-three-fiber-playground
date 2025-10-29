import React, { useCallback } from 'react'
import { BodyType2 } from './BodyType2'
import { BodyType1 } from './BodyType1'
import { useCharacterCreatorStore } from '../../stores/useCharacterCreatorStore'

export function CustomPlayer () {
  const characterState = useCharacterCreatorStore(state => state.characterState)
  const colors = useCharacterCreatorStore(state => state.colors)
  const setHoveredPart = useCharacterCreatorStore(state => state.setHoveredPart)
  const clearHoveredPart = useCharacterCreatorStore(state => state.clearHoveredPart)
  const setPopoverInteracting = useCharacterCreatorStore(state => state.setPopoverInteracting)

  const handleHovered = useCallback((part, x, y) => {
    setHoveredPart(part, { x, y })
  }, [setHoveredPart])

  const handleClearHovered = useCallback(() => {
    clearHoveredPart({ delay: 400 })
  }, [clearHoveredPart])

  const handleSelected = useCallback((part, x, y) => {
    setPopoverInteracting(true)
    setHoveredPart(part, { x, y }, { force: true })
  }, [setPopoverInteracting, setHoveredPart])

  return (
    <>
      {characterState === 'bodytype2' && (
        <BodyType2
          handleHovered={handleHovered}
          clearHovered={handleClearHovered}
          colors={colors}
          handleSelected={handleSelected}
        />
      )}
      {characterState === 'bodytype1' && (
        <BodyType1
          handleHovered={handleHovered}
          clearHovered={handleClearHovered}
          colors={colors}
          handleSelected={handleSelected}
        />
      )}
    </>
  )
}
