import { useState } from 'react'
import { LockKeyhole, UserRound } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useGuestLogin, useLogin, useRegister } from '../api/generated'
import { useAppForm } from '../components/form/useAppForm'
import { authStorage } from '../lib/auth'

type Mode = 'login' | 'register'

type AuthPayload = {
  accessToken?: string
}

function AuthForm({ mode, onSuccess }: { mode: Mode; onSuccess: (payload: AuthPayload) => void }) {
  const login = useLogin()
  const register = useRegister()
  const mutation = mode === 'login' ? login : register

  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
      rememberSession: true,
      sessionScope: 'standard',
    },
    onSubmit: async ({ value }) => {
      const credentials = {
        username: value.username.trim(),
        password: value.password,
      }

      const response =
        mode === 'login'
          ? await login.mutateAsync({ data: credentials })
          : await register.mutateAsync({ data: credentials })

      onSuccess(response.data)
    },
  })

  return (
    <form
      className="card border border-base-300 bg-base-200/40 shadow-xl"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="card-body gap-4">
        <form.AppField
          name="username"
          validators={{
            onBlur: ({ value }) => (value.trim() ? undefined : 'Username is required.'),
          }}
        >
          {(field) => (
            <field.TextInputField
              autoComplete="username"
              description="Your account name"
              icon={UserRound}
              label="Username"
              placeholder="ada_lovelace"
            />
          )}
        </form.AppField>

        <form.AppField
          name="password"
          validators={{
            onBlur: ({ value }) => (value ? undefined : 'Password is required.'),
          }}
        >
          {(field) => (
            <field.TextInputField
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              description={mode === 'login' ? 'Use your account password' : 'Choose a secure password'}
              icon={LockKeyhole}
              label="Password"
              placeholder="••••••••"
              type="password"
            />
          )}
        </form.AppField>

        <form.AppField name="sessionScope">
          {(field) => (
            <field.RadioGroupField
              description="Prepared for auth policy extension without changing consumers."
              label="Session scope"
              options={[
                { description: 'Default session behavior for app users.', label: 'Standard', value: 'standard' },
                { description: 'Reserved for future access tiers.', label: 'Elevated', value: 'elevated' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="rememberSession">
          {(field) => (
            <field.CheckboxField
              description="Keep this session active on this browser"
              label="Remember session"
            />
          )}
        </form.AppField>

        <button className="btn btn-primary" disabled={mutation.isPending} type="submit">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        {mutation.error ? (
          <p className="rounded-box border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">
            Authentication failed.
          </p>
        ) : null}
      </div>
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
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="join w-full">
          <button
            className={`btn join-item flex-1 ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`btn join-item flex-1 ${mode === 'register' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode('register')}
            type="button"
          >
            Register
          </button>
        </div>
        <AuthForm mode={mode} onSuccess={handleAuthSuccess} />
      </div>

      <div className="card border border-base-300 bg-base-200/40 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Guest access</h2>
          <p className="text-sm text-base-content/70">
            Use a guest account to browse protected areas without registration.
          </p>
          <button className="btn btn-accent mt-3" disabled={guestLogin.isPending} onClick={() => guestLogin.mutate()} type="button">
            Continue as guest
          </button>
        </div>
      </div>
    </section>
  )
}
