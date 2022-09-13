import React from 'react'
import './App.css'
import AppRouter from './components/Comon/AppRouter'
import Footer from './components/Footer/Footer'
import AuthContextProvider from './shared/AuthContext'

const App = () => {
  
  return (
    <AuthContextProvider>
      <AppRouter />
      <Footer />
    </AuthContextProvider>
  )

}

export default App
