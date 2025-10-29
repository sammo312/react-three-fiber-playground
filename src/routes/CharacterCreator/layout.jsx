import { useMemo } from 'react'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { useCharacterCreatorStore } from '../../stores/useCharacterCreatorStore'
import { Button } from '@/components/ui/button'

const DEFAULT_COLOR = '#ffffff'


const tabListStyle = {
  display: 'flex',
  gap: '8px'
}

const tabButtonStyle = (active) => ({
  border: 'none',
  borderRadius: '999px',
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.24em',
  background: active ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
  color: active ? '#111111' : '#f5f5f5',
  cursor: 'pointer',
  transition: 'background 160ms ease, color 160ms ease'
})

const selectorRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  width: '100%',
  padding: '4px 0',
  fontSize: '20px',
  fontWeight: 600,
  textTransform: 'capitalize'
}



const colorSummaryStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontSize: '14px',
  color: 'rgba(230, 230, 230, 0.84)'
}

const colorSummaryTitleStyle = {
  fontSize: '18px',
  fontWeight: 600,
  textTransform: 'capitalize'
}

const colorSummarySubStyle = {
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
  color: 'rgba(180, 180, 180, 0.6)'
}

const popoverAnchorBaseStyle = {
  position: 'fixed',
  pointerEvents: 'none',
  transform: 'translate(-50%, -110%)',
  zIndex: 1000
}

function formatPartName (part) {
  if (!part) return ''
  return part
    .replace(/_/g, ' ')
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function normaliseColorValue (value) {
  if (typeof value !== 'string') return DEFAULT_COLOR
  const trimmed = value.trim()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    return trimmed
  }
  return DEFAULT_COLOR
}



function BodySelector () {
  const characterState = useCharacterCreatorStore(state => state.characterState)
  const selectPreviousCharacter = useCharacterCreatorStore(state => state.selectPreviousCharacter)
  const selectNextCharacter = useCharacterCreatorStore(state => state.selectNextCharacter)

  return (
    <div style={selectorRowStyle}>
      <Button
        type='button'
        onClick={selectPreviousCharacter}
        aria-label='Previous body preset'
      >
        <FaChevronCircleLeft size={28} />
      </Button>
      <span>{characterState}</span>
      <Button
        type='button'
        onClick={selectNextCharacter}
        aria-label='Next body preset'
      >
        <FaChevronCircleRight size={28} />
      </Button>
    </div>
  )
}




function ColorPopover () {
  const hoveredPart = useCharacterCreatorStore(state => state.hoveredPart)
  const pinnedPart = useCharacterCreatorStore(state => state.pinnedPart)
  const hoveredPosition = useCharacterCreatorStore(state => state.hoveredPosition)
  const colors = useCharacterCreatorStore(state => state.colors)
  const setColorForPart = useCharacterCreatorStore(state => state.setColorForPart)
  const setPopoverInteracting = useCharacterCreatorStore(state => state.setPopoverInteracting)
  const clearHoveredPart = useCharacterCreatorStore(state => state.clearHoveredPart)

  const activePart = pinnedPart ?? hoveredPart
  const open = Boolean(activePart && hoveredPosition)

  const anchorStyle = useMemo(() => {
    if (!hoveredPosition) {
      return {
        ...popoverAnchorBaseStyle,
        top: -9999,
        left: -9999
      }
    }
    return {
      ...popoverAnchorBaseStyle,
      top: hoveredPosition.y,
      left: hoveredPosition.x
    }
  }, [hoveredPosition])

  const activeColor = activePart ? normaliseColorValue(colors[activePart]) : DEFAULT_COLOR

  const handleColorChange = (event) => {
    if (!activePart) return
    setColorForPart(activePart, normaliseColorValue(event.target.value))
  }

  const handleClose = (force = false) => {
    setPopoverInteracting(false)
    clearHoveredPart({ force })
  }

  return (
    <Popover
      open={open}
      modal={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose(true)
        }
      }}
    >
      <PopoverAnchor asChild>
        <div style={anchorStyle} />
      </PopoverAnchor>
      {activePart && (
        <PopoverContent
          sideOffset={14}
          align='center'
          className='w-72 space-y-4 rounded-xl border border-white/10 bg-neutral-900/95 text-neutral-100 shadow-2xl backdrop-blur-md'
          onOpenAutoFocus={(event) => event.preventDefault()}
          onPointerEnter={() => setPopoverInteracting(true)}
          onPointerLeave={() => {
            setPopoverInteracting(false)
            clearHoveredPart({ delay: 400 })
          }}
          onPointerDownCapture={() => setPopoverInteracting(true)}
        >
          <div className='flex items-center justify-between gap-3'>
            <div>
              <div className='text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-500'>
                Editing
              </div>
              <div className='text-lg font-semibold'>
                {formatPartName(activePart)}
              </div>
            </div>
            <button
              type='button'
              onClick={() => handleClose(true)}
              className='rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-neutral-300 transition hover:bg-white/10'
            >
              Close
            </button>
          </div>
          <div className='flex items-center gap-4'>
            <input
              type='color'
              value={activeColor}
              onChange={handleColorChange}
              className='h-12 w-12 cursor-pointer appearance-none rounded-xl border border-white/20 bg-transparent p-0'
            />
            <div className='text-sm leading-snug text-neutral-300'>
              Adjust the palette for {formatPartName(activePart)}.
            </div>
          </div>
          <div className='text-xs uppercase tracking-[0.28em] text-neutral-500'>
            Hex {activeColor.toUpperCase()}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

function CharacterCreatorOverlay () {
  return (
    <div className='pointer-events-none absolute inset-0 z-[900]'>
      <div className='absolute inset-0 flex flex-col justify-between gap-6 p-6 pt-24'>
        <div className='pointer-events-auto'>
        </div>
    
      </div>
    </div>
  )
}

export default function Layout ({ children }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative',display: 'flex', flexDirection: 'column' }}>
 <BodySelector />

      {children}
        <ColorPopover />
    </div>
  )
}
