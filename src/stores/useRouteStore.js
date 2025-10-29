import { create } from 'zustand'

const defaultSelectedId = '/'

export const useRouteStore = create((set, get) => ({
  tree: null,
  nodesById: {},
  flattened: [],
  selectedId: defaultSelectedId,
  selectedNode: null,
  activeEntry: null,
  setSnapshot: ({ tree, nodesById }) => {
    const flattened = flattenTree(tree)
    set((state) => {
      const hasSelected = nodesById[state.selectedId]
      const nextSelectedId = hasSelected ? state.selectedId : defaultSelectedId
      const nextEntry = flattened.find(entry => entry.id === nextSelectedId) || flattened[0] || null
      return {
        tree,
        nodesById,
        flattened,
        selectedId: nextSelectedId,
        selectedNode: nodesById[nextSelectedId] ?? null,
        activeEntry: nextEntry
      }
    })
  },
  selectNode: (id) => set((state) => {
    const entry = state.flattened.find(item => item.id === id)
    if (!entry) return {}
    return {
      selectedId: id,
      selectedNode: state.nodesById[id] ?? null,
      activeEntry: entry
    }
  }),
  selectByUrl: (urlPath) => set((state) => {
    if (!state.flattened) return {}
    const entry = state.flattened.find((item) => item.urlPath === urlPath)
    if (!entry) return {}
    return {
      selectedId: entry.id,
      selectedNode: state.nodesById[entry.id] ?? null,
      activeEntry: entry
    }
  }),
  refreshTree: async () => {
    const { routeStoreSnapshot } = await import('../appRouter')
    get().setSnapshot(routeStoreSnapshot)
  }
}))

export async function hydrateRouteStore () {
  const { routeStoreSnapshot } = await import('../appRouter')
  useRouteStore.getState().setSnapshot(routeStoreSnapshot)
}

function flattenTree (node, parentLabel = 'Home') {
  if (!node) return []
  const entries = []

  const label = node.id === '/' ? parentLabel : (node.segment || parentLabel)

  if (node.id !== '/') {
    const shouldInclude = node.hasPage || (Array.isArray(node.children) && node.children.length > 0)
    if (shouldInclude) {
      entries.push({
        id: node.id,
        label,
        urlPath: node.urlPath,
        routePath: node.routePath,
        isRoot: false
      })
    }
  } else {
    entries.push({
      id: node.id,
      label,
      urlPath: '/',
      routePath: '/',
      isRoot: true
    })
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(child => {
      entries.push(...flattenTree(child, child.segment || label))
    })
  }

  return entries
}
