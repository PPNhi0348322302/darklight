import React, {useEffect, useRef} from 'react'
import './App.css'
import AppRouter from './components/Comon/AppRouter'
import Footer from './components/Footer/Footer'
import {useStore} from './hooks'
import {actions} from './store'
import axios from "axios"

const App = () => {
  const data  = useStore() 
  const effectRan = useRef(false)
  
  //check auto login
  useEffect(() =>{
    const autoLogin = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user`,
          {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : data[0].token
            },
          },
        )
        .then(response =>{
          if( response && !response.data.login ){
            data[1](actions.setUser(response.data)) 
            data[1](actions.setToken(response.data.accessToken))
            data[1](actions.setLogIn(true))
          }
          else {
            data[1](actions.setUser({})) 
            data[1](actions.setToken(''))
            data[1](actions.setLogIn(false))
          }
        })
      } 
      catch (error) {
          return {err: error}
      }
    }
    if (effectRan.current === true ){
      autoLogin()
    }
    return () => {
      effectRan.current = true
    }
  },[])

  return (
      <>
      <AppRouter />
      <Footer />
      </>
  )

}

export default App
