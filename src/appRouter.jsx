import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useOutlet } from 'react-router'

// eagerly grab every page/layout module under routes so Vite can include them in the build
const pageModules = import.meta.glob('./routes/**/page.{jsx,tsx,js,ts}', { eager: true })
const layoutModules = import.meta.glob('./routes/**/layout.{jsx,tsx,js,ts}', { eager: true })

function createNode ({ key, routePath }) {
  return {
    key,
    routePath,
    page: null,
    layout: null,
    files: {},
    children: new Map()
  }
}

// translate Next-style dynamic segments into React Router syntax (e.g. "[id]" -> ":id")
function segmentToPath (segment) {
  if (!segment) return segment
  if (segment.startsWith('[') && segment.endsWith(']')) {
    const param = segment.slice(1, -1)
    if (param.startsWith('...')) {
      return '*'
    }
    return `:${param}`
  }
  return segment
}

function getOrCreateNode (root, segments) {
  // drill down into the tree, creating nodes for each folder segment on demand
  let current = root
  segments.forEach((segment) => {
    if (!segment) return
    if (!current.children.has(segment)) {
      current.children.set(segment, createNode({
        key: segment,
        routePath: segmentToPath(segment)
      }))
    }
    current = current.children.get(segment)
  })
  return current
}

function assignModules (root, modules, type) {
  Object.entries(modules).forEach(([filePath, moduleExports]) => {
    const exportDefault = moduleExports?.default
    if (!exportDefault) {
      console.warn(`[appRouter] Missing default export in ${filePath}`)
      return
    }

    const normalized = filePath.replace('./routes/', '')
    const segments = normalized.split('/')
    const fileName = segments.pop()

    const targetNode = getOrCreateNode(root, segments.filter(Boolean))
    targetNode[type] = exportDefault
    targetNode.files[type] = {
      importPath: filePath.replace('./', ''),
      fileName
    }
  })
}

function sortChildren (node) {
  return Array
    .from(node.children.values())
    .sort((a, b) => a.key.localeCompare(b.key))
}

// Layouts act like Next.js app router layouts: they wrap whatever the outlet renders underneath
function LayoutBoundary ({ component: LayoutComponent }) {
  const outlet = useOutlet()
  if (!LayoutComponent) {
    return outlet
  }
  return (
    <LayoutComponent>
      {outlet}
    </LayoutComponent>
  )
}

// Page components can still render nested routes underneath by leaving an <Outlet />
function PageBoundary ({ component: PageComponent }) {
  return (
    <>
      <PageComponent />
      <Outlet />
    </>
  )
}

function OutletBoundary () {
  return <Outlet />
}

function buildRoute (node) {
  const children = sortChildren(node)
    .map(buildRoute)
    .filter(Boolean)

  const hasLayout = Boolean(node.layout)
  const hasPage = Boolean(node.page)
  const hasChildren = children.length > 0

  if (!hasLayout && !hasPage && !hasChildren) {
    return null
  }

  const route = {}
  if (node.routePath) {
    route.path = node.routePath
  }

  if (hasLayout) {
    const nestedChildren = []
    if (hasPage) {
      nestedChildren.push({
        index: true,
        element: React.createElement(node.page)
      })
    }
    nestedChildren.push(...children)

    route.element = React.createElement(LayoutBoundary, { component: node.layout })
    if (nestedChildren.length > 0) {
      route.children = nestedChildren
    }
    return route
  }

  if (hasPage) {
    if (hasChildren) {
      route.element = React.createElement(PageBoundary, { component: node.page })
      route.children = children
      return route
    }
    route.element = React.createElement(node.page)
    return route
  }

  if (hasChildren) {
    route.element = React.createElement(OutletBoundary)
    route.children = children
    return route
  }

  return null
}

function buildRootTree () {
  const root = createNode({ key: '__root__', routePath: null })
  assignModules(root, layoutModules, 'layout')
  assignModules(root, pageModules, 'page')
  return root
}

function collectRootChildren (root) {
  return sortChildren(root)
    .map(buildRoute)
    .filter(Boolean)
}

// turn the internal tree structure into serializable data for tools like a route/file explorer
function serializeNode (node, parent = { fsSegments: [], urlPath: '/' }) {
  const isRoot = node.key === '__root__'
  const fsSegments = isRoot ? parent.fsSegments : [...parent.fsSegments, node.key]
  const routeSegment = node.routePath ?? ''
  const urlPath = (() => {
    if (isRoot) return '/'
    const prefix = parent.urlPath === '/' ? '' : parent.urlPath
    const resolved = [prefix, routeSegment || node.key].filter(Boolean).join('/')
    return resolved.startsWith('/') ? resolved : `/${resolved}`
  })()

  const serializedChildren = sortChildren(node).map(child =>
    serializeNode(child, { fsSegments, urlPath })
  )

  return {
    id: fsSegments.join('/') || '/',
    segment: isRoot ? '' : node.key,
    routePath: routeSegment,
    urlPath,
    hasPage: Boolean(node.page),
    hasLayout: Boolean(node.layout),
    files: {
      page: node.files.page?.importPath ?? null,
      layout: node.files.layout?.importPath ?? null
    },
    children: serializedChildren
  }
}

function indexTree (node, acc = {}) {
  acc[node.id] = node
  node.children.forEach(child => indexTree(child, acc))
  return acc
}

const rootTree = buildRootTree()
const childRoutes = collectRootChildren(rootTree)
const rootLayout = rootTree.layout
const rootPage = rootTree.page

const routes = (() => {
  const hasRootLayout = Boolean(rootLayout)
  const hasRootPage = Boolean(rootPage)
  const hasChildren = childRoutes.length > 0

  if (hasRootLayout) {
    const layoutChildren = []
    if (hasRootPage) {
      layoutChildren.push({
        index: true,
        element: React.createElement(rootPage)
      })
    }
    layoutChildren.push(...childRoutes)

    return [{
      path: '/',
      element: React.createElement(LayoutBoundary, { component: rootLayout }),
      children: layoutChildren.length > 0 ? layoutChildren : undefined
    }]
  }

  if (hasRootPage) {
    if (hasChildren) {
      return [{
        path: '/',
        element: React.createElement(PageBoundary, { component: rootPage }),
        children: childRoutes
      }]
    }

    return [{
      path: '/',
      element: React.createElement(rootPage)
    }]
  }

  if (hasChildren) {
    return [{
      path: '/',
      element: React.createElement(OutletBoundary),
      children: childRoutes
    }]
  }

  return []
})()

export const appRouter = createBrowserRouter(routes)
export const appRouteTree = serializeNode(rootTree)
export const appRouteIndex = indexTree(appRouteTree)

export const routeStoreSnapshot = {
  tree: appRouteTree,
  nodesById: appRouteIndex
}

export function AppRouterProvider ({ router = appRouter }) {
  return <RouterProvider router={router} />
}

export { routes as appRoutes }
