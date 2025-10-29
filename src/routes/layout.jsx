import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRouteStore } from '@/stores/useRouteStore'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

export default function Layout ({ children }) {
  const refreshTree = useRouteStore(state => state.refreshTree)
  const activeEntry = useRouteStore(state => state.activeEntry)
  const selectByUrl = useRouteStore(state => state.selectByUrl)
  const location = useLocation()

  useEffect(() => {
    refreshTree()
  }, [refreshTree])

  useEffect(() => {
    selectByUrl(location.pathname)
  }, [location.pathname, selectByUrl])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='relative z-[1200] flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur shadow-sm'>
          <SidebarTrigger />
          <span className='text-xl font-semibold  '>
            {activeEntry?.label ?? 'Dashboard'}
          </span>
        </header>
        <section className='relative z-10 flex-1 overflow-auto p-4'>
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
