import { LogOut } from 'lucide-react'
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
    <section className="card border border-base-300 bg-base-200/40 shadow-xl">
      <div className="card-body space-y-3">
        <h2 className="card-title">Authenticated session</h2>
        {me.isLoading ? <p className="text-sm text-base-content/70">Loading profile…</p> : null}
        {me.data?.data ? (
          <ul className="space-y-1 text-sm">
            <li>Username: {me.data.data.username}</li>
            <li>Role: {me.data.data.role}</li>
            <li>User ID: {me.data.data.userId}</li>
          </ul>
        ) : null}
        <button className="btn btn-outline btn-error w-fit" onClick={logout} type="button">
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </section>
  )
}
