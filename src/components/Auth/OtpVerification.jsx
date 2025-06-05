import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

const OtpVerification = () => {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { verifyOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  if (!email) return <Navigate to="/signup" />

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await verifyOtp(email, otp)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setLoading(true)
      await axios.post('https://medical-student-app-backend.onrender.com/api/auth/resend-otp', { email })
      setError('OTP resent to your email')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Verify OTP</h2>
        {error && <p className={error.includes('resent') ? 'text-green-500 mb-4 text-center' : 'text-red-500 mb-4 text-center'}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError('')
              }}
              className="w-full p-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <button
          onClick={handleResendOtp}
          disabled={loading}
          className="mt-4 w-full text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 text-sm"
        >
          Resend OTP
        </button>
      </div>
    </div>
  )
}

export default OtpVerification