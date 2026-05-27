export function useAuth() {
  const getUser = () => {
    try {
      const raw = localStorage.getItem('adminshop_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const login = (username, pin) => {
    const userData = { username, pin, loggedAt: new Date().toISOString() }
    localStorage.setItem('adminshop_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    localStorage.removeItem('adminshop_user')
  }

  const isAuthenticated = () => !!getUser()

  return { getUser, login, logout, isAuthenticated }
}