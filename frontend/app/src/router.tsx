import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { authStorage } from './lib/auth'

const rootRoute = createRootRoute({
  component: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 bg-slate-50 p-6 text-slate-900">
      <header className="rounded bg-slate-900 p-4 text-white">
        <h1 className="text-xl font-semibold">dotnet + React template</h1>
        <p className="text-sm text-slate-200">Web API auth + guest flow using TanStack Query/Form and Orval hooks.</p>
      </header>
      <Outlet />
    </div>
  ),
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!authStorage.getToken()) {
      throw redirect({ to: '/' })
    }
  },
  component: DashboardPage,
})

const routeTree = rootRoute.addChildren([authRoute, dashboardRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
