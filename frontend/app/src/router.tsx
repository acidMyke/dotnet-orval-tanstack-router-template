import { Outlet, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { authStorage } from './lib/auth'

const rootRoute = createRootRoute({
  component: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 bg-base-100 p-6 text-base-content">
      <header className="hero rounded-box border border-base-300 bg-base-200/60">
        <div className="hero-content w-full justify-start py-8">
          <div>
            <h1 className="text-2xl font-semibold">dotnet + React template</h1>
            <p className="text-sm text-base-content/70">
              Web API auth + guest flow using TanStack Query/Form and Orval hooks.
            </p>
          </div>
        </div>
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
