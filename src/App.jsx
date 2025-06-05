// App.jsx
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App