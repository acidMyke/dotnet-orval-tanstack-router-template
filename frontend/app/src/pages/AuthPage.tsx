import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useGuestLogin, useLogin, useRegister } from '../api/generated'
import { authStorage } from '../lib/auth'

type Mode = 'login' | 'register'

type AuthPayload = {
  accessToken?: string
}

function AuthForm({ mode, onSuccess }: { mode: Mode; onSuccess: (payload: AuthPayload) => void }) {
  const login = useLogin()
  const register = useRegister()
  const mutation = mode === 'login' ? login : register

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const response =
        mode === 'login'
          ? await login.mutateAsync({ data: value })
          : await register.mutateAsync({ data: value })

      onSuccess(response.data)
    },
  })

  return (
    <form
      className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 shadow"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="username">{(field) => <input className="rounded border px-3 py-2" placeholder="Username" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />}</form.Field>
      <form.Field name="password">{(field) => <input className="rounded border px-3 py-2" placeholder="Password" type="password" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />}</form.Field>
      <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" type="submit" disabled={mutation.isPending}>
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </button>
      {mutation.error ? <p className="text-xs text-red-600">Authentication failed.</p> : null}
    </form>
  )
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const navigate = useNavigate()

  const goToDashboard = () => {
    void navigate({ to: '/dashboard' })
  }

  const handleAuthSuccess = (payload: AuthPayload) => {
    if (!payload.accessToken) {
      return
    }

    authStorage.setToken(payload.accessToken)
    goToDashboard()
  }

  const guestLogin = useGuestLogin({
    mutation: {
      onSuccess: (result) => {
        if (!result.data.accessToken) {
          return
        }

        authStorage.setToken(result.data.accessToken)
        goToDashboard()
      },
    },
  })

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1 text-sm" type="button" onClick={() => setMode('login')}>
            Login
          </button>
          <button className="rounded border px-3 py-1 text-sm" type="button" onClick={() => setMode('register')}>
            Register
          </button>
        </div>
        <AuthForm mode={mode} onSuccess={handleAuthSuccess} />
      </div>

      <div className="rounded border border-slate-200 bg-white p-4 shadow">
        <h2 className="text-lg font-medium">Guest Access</h2>
        <p className="mt-2 text-sm text-slate-600">Use a guest account to browse protected areas without registration.</p>
        <button
          className="mt-4 rounded bg-emerald-600 px-3 py-2 text-sm text-white"
          type="button"
          onClick={() => guestLogin.mutate()}
          disabled={guestLogin.isPending}
        >
          Continue as guest
        </button>
      </div>
    </section>
  )
}
