// contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const setAuth = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
  }

  const login = async (email, password) => {
    const response = await axios.post('https://medical-student-app-backend.onrender.com/api/auth/login', { email, password })
    const { token, user } = response.data
    setAuth(token, user)
  }

  const signup = async (fullName, username, email, password) => {
    await axios.post('https://medical-student-app-backend.onrender.com/api/auth/signup', { fullName, username, email, password })
  }

  const verifyOtp = async (email, otp) => {
    const response = await axios.post('https://medical-student-app-backend.onrender.com/api/auth/verify-otp', { email, otp })
    const { token, user } = response.data
    setAuth(token, user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, verifyOtp, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
