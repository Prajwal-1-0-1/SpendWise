import api from './api'

export async function register(username, password) {
  const res = await api.post('/register', { username, password })
  if (res.data?.message === 'User already exists') {
    throw new Error('Username already taken.')
  }
  return res.data
}

export async function login(username, password) {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)

  const res = await api.post('/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return res.data
}
