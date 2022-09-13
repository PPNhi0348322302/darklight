import React from 'react'
import styled from 'styled-components'
import LoginPage from '../components/Account/LoginPage'
import { TabTitle } from '../store/Genera'
const Login = () => {
  TabTitle('Login | DarkLight')
  return (
    <Container>
        <LoginPage />
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
