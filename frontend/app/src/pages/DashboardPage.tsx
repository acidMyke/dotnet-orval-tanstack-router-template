import { useNavigate } from '@tanstack/react-router'
import { useMe } from '../api/generated'
import { authStorage } from '../lib/auth'

export function DashboardPage() {
  const navigate = useNavigate()
  const me = useMe()

  const logout = () => {
    authStorage.clearToken()
    void navigate({ to: '/' })
  }

  return (
    <section className="space-y-3 rounded border border-slate-200 bg-white p-4 shadow">
      <h2 className="text-lg font-medium">Authenticated session</h2>
      {me.isLoading ? <p className="text-sm text-slate-600">Loading profile…</p> : null}
      {me.data?.data ? (
        <ul className="text-sm">
          <li>Username: {me.data.data.username}</li>
          <li>Role: {me.data.data.role}</li>
          <li>User ID: {me.data.data.userId}</li>
        </ul>
      ) : null}
      <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" onClick={logout} type="button">
        Logout
      </button>
    </section>
  )
}
