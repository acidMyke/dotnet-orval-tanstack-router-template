import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5154',
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = ['Bearer', token].join(' ')
  }
  return config
})

export const customInstance = async <T>(url: string, options: RequestInit): Promise<T> => {
  const body =
    typeof options.body === 'string' && options.body.length > 0
      ? JSON.parse(options.body)
      : options.body

  return instance({
    url,
    method: options.method,
    headers: options.headers as Record<string, string> | undefined,
    data: body,
    signal: options.signal ?? undefined,
  }).then(({ data }) => data as T)
}
