import React from 'react'
import RegisterPage from '../components/Account/RegisterPage'
import styled from 'styled-components'
import { TabTitle } from '../store/Genera'

const Register = () => {
  TabTitle('Register | DarkLight')
  return (
    <Container>
        <RegisterPage />
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

export default Register
