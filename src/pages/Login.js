import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import LoginPage from '../components/Account/LoginPage'
import { TabTitle } from '../store/Genera'
const Login = () => {
  TabTitle('Login | DarkLight')

    //screen
    const [type, setType] = useState(window.innerWidth <=480 ? 2 : window.innerWidth <=900 ? 1 :0)

    useEffect(() => {
      const handleResize = () => {
        if(window.innerWidth <= 480)
          setType(2)
        else if(window.innerWidth <= 900)
          setType(1)
        else setType(0)
      }
  
      window.addEventListener("resize", handleResize)
  
      return () => window.addEventListener("resize", handleResize)
    },[window.innerWidth])

  return (
    <Container>
        <LoginPage type={type}/>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  color: #fff;
`
export default Login
