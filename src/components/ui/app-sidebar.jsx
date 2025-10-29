import { useEffect, useCallback } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarGroupAction,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar'
import { useRouteStore } from '@/stores/useRouteStore'
import { cn } from '@/lib/utils'
import { useLocation, useNavigate } from 'react-router'

function RouteList () {
  const flattened = useRouteStore(state => state.flattened)
  const activeEntry = useRouteStore(state => state.activeEntry)
  const selectNode = useRouteStore(state => state.selectNode)
  const refreshTree = useRouteStore(state => state.refreshTree)
  const selectByUrl = useRouteStore(state => state.selectByUrl)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    refreshTree()
  }, [refreshTree])

  useEffect(() => {
    selectByUrl(location.pathname)
  }, [location.pathname, selectByUrl])

  const handleNavigate = useCallback((entry) => {
    if (!entry) return
    const url = entry.urlPath || '/'
    selectNode(entry.id)
    navigate(url)
  }, [navigate, selectNode])

  if (!flattened || flattened.length === 0) {
    return <div className='px-2 text-xs text-muted-foreground'>Loading routes…</div>
  }

  return (
    <div className='flex flex-col gap-1 px-1 py-1'>
      {flattened.map((entry) => (
        <button
          key={entry.id}
          type='button'
          onClick={() => handleNavigate(entry)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/40',
            activeEntry?.id === entry.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-sidebar-foreground/90 hover:bg-sidebar-border/60'
          )}
        >
          <span className='truncate font-medium'>{entry.label || 'Route'}</span>
          <span className={cn(
            'text-[10px] font-semibold uppercase tracking-[0.3em]',
            activeEntry?.id === entry.id ? 'text-primary-foreground/80' : 'text-sidebar-foreground/40'
          )}>
            →
          </span>
        </button>
      ))}
    </div>
  )
}

export function AppSidebar () {
  const refreshTree = useRouteStore(state => state.refreshTree)

  return (
    <>
      <Sidebar>
        <SidebarHeader className='flex items-center justify-between gap-2'>
          <div className='text-sm font-semibold'>Routes</div>
          <SidebarTrigger className='md:hidden' />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>App Router</SidebarGroupLabel>
            <RouteList />
          </SidebarGroup>
        </SidebarContent>
       
      </Sidebar>
      <SidebarRail />
    </>
  )
}
