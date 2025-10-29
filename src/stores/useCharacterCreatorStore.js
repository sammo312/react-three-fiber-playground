import { create } from 'zustand'

const characterOptions = ['bodytype1', 'bodytype2']
const viewOptions = ['Body', 'Colors']
const initialColors = {
  hair: '#000000',
  torso: '#ff7f7f',
  skin: '#d2a679',
  legs: '#f5d76e',
  eye1: '#000000',
  eye2: '#000000',
  eye3: '#6b4f4f',
  teeth1: '#f2f2f2',
  teeth2: '#f2f2f2',
  teeth3: '#f2f2f2'
}

function cycleValue (options, current, direction) {
  const index = options.indexOf(current)
  if (index === -1) return options[0]
  const nextIndex = (index + direction + options.length) % options.length
  return options[nextIndex]
}

let hoverClearTimeoutId = null
let lastHoverUpdateTimestamp = 0
const POSITION_THRESHOLD_PX = 2

export const useCharacterCreatorStore = create((set, get) => ({
  characterOptions,
  viewOptions,
  characterState: characterOptions[0],
  viewState: viewOptions[0],
  hoveredPart: null,
  hoveredPosition: null,
  pinnedPart: null,
  isPopoverInteracting: false,
  colors: initialColors,
  setViewState: (view) => {
    if (!get().viewOptions.includes(view)) return
    set({ viewState: view })
  },
  setCharacterState: (state) => {
    if (!get().characterOptions.includes(state)) return
    set({ characterState: state, hoveredPart: null, pinnedPart: null })
  },
  selectNextCharacter: () => {
    const { characterOptions: opts, characterState: current } = get()
    set({ characterState: cycleValue(opts, current, 1), hoveredPart: null, pinnedPart: null })
  },
  selectPreviousCharacter: () => {
    const { characterOptions: opts, characterState: current } = get()
    set({ characterState: cycleValue(opts, current, -1), hoveredPart: null, pinnedPart: null })
  },
  setHoveredPart: (part, position, { force = false } = {}) => {
    if (!part || !position) return

    const state = get()
    const now = typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now()

    if (!force) {
      if (state.isPopoverInteracting) {
        return
      }

      if (state.pinnedPart) {
        if (state.pinnedPart === part) {
          return
        }
        return
      }

      const samePart = state.hoveredPart === part
      if (samePart && state.hoveredPosition) {
        const dx = state.hoveredPosition.x - position.x
        const dy = state.hoveredPosition.y - position.y
        const distanceSq = dx * dx + dy * dy
        if (distanceSq <= POSITION_THRESHOLD_PX * POSITION_THRESHOLD_PX) {
          if (now - lastHoverUpdateTimestamp < 32) {
            return
          }
        }
      }
    }

    if (hoverClearTimeoutId) {
      clearTimeout(hoverClearTimeoutId)
      hoverClearTimeoutId = null
    }

    set((current) => ({
      hoveredPart: part,
      hoveredPosition: position,
      pinnedPart: force ? part : current.pinnedPart
    }))

    lastHoverUpdateTimestamp = now
  },
  clearHoveredPart: ({ force = false, delay = 0 } = {}) => {
    const state = get()
    if (!force) {
      if (state.isPopoverInteracting || state.pinnedPart) {
        return
      }
    }

    if (hoverClearTimeoutId) {
      clearTimeout(hoverClearTimeoutId)
      hoverClearTimeoutId = null
    }

    const execute = () => {
      set((current) => {
        if (!force && (current.isPopoverInteracting || current.pinnedPart)) {
          return {}
        }
        return {
          hoveredPart: null,
          hoveredPosition: null,
          pinnedPart: force ? null : current.pinnedPart
        }
      })
    }

    if (delay > 0) {
      hoverClearTimeoutId = setTimeout(() => {
        hoverClearTimeoutId = null
        execute()
      }, delay)
    } else {
      execute()
    }
  },
  setPopoverInteracting: (value) => {
    if (!value && hoverClearTimeoutId) {
      clearTimeout(hoverClearTimeoutId)
      hoverClearTimeoutId = null
    }
    set({ isPopoverInteracting: value })
  },
  setColorForPart: (part, color) => {
    if (!part) return
    set((state) => ({
      colors: {
        ...state.colors,
        [part]: color
      }
    }))
  }
}))
