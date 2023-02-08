import React, {useState} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import axios from "axios"
import {useStore} from '../../hooks'
import {actions} from '../../store'

const LoginPage = () => {
    let navigate = useNavigate()
    const data = useStore()
    const handleLogin = () => {
        navigate('/login')
    }
    const base_avatar = 'https://firebasestorage.googleapis.com/v0/b/darklight-9102.appspot.com/o/69e6ca1f9a304e8512236e61955b130e.jpg?alt=media&token=46a298ea-a1d3-4631-a0ba-f569c4bd18c7'

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState()

    //Register account

    const registerUser = async ({email, name, password, avatar}) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/user/register`,
          {email, name, password, avatar},
          { withCredentials: true }
        )
        return response.data
      } 
      catch (error) {
          console.log(error)
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError()
      if(password !== confirmPassword){
          setError('Password does not match')
      } else {
        try{
          const res = await registerUser({email, name, password, avatar: base_avatar})
          if(res.accessToken){
            data[1](actions.setUser(res)) 
            data[1](actions.setLogIn(true))
            data[1](actions.setToken(res.accessToken))
            navigate('/')
          }
        }
        catch(error) {
          console.log(error);
        }
      }
  }
  
    return (
    <MainContainer>
      <WelcomeText>Register</WelcomeText>
      
      <InputContainer
          onSubmit = {handleSubmit}
      >
        <span>{error}</span>
        <StyledInput 
            type="email" 
            placeholder="Email" 
            value = {email}
            onChange={e => setEmail(e.target.value)}
        />
        <StyledInput 
            type="text" 
            placeholder="Name" 
            value = {name}
            onChange={e => setName(e.target.value)}
        />

        <StyledInput 
            type="password" 
            placeholder="password" 
            value = {password}
            onChange={e => setPassword(e.target.value)}
        />
        <StyledInput 
            type="password" 
            placeholder="Confirm password" 
            value = {confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
        />

        <ButtonContainer>
          <StyledButton 
              type='submit'
          >
              Register
          </StyledButton>
        </ButtonContainer>
      </InputContainer>
      
      <TitleContainer>
        <button onClick={handleLogin}>Login Now</button>
      </TitleContainer>
    </MainContainer>
  )
}

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: #ffffff;
  @media only screen and (min-width: 411px) {
    width: 80vw;
    height: 90vh;
  }
  @media only screen and (min-width: 768px) {
    width: 80vw;
    height: 80vh;
  }
  @media only screen and (min-width: 1024px) {
    width: 30vw;
    height: 60vh;
  }
`;

const WelcomeText = styled.h2`
  margin: 3rem 0 ;
  text-transform: uppercase;
  letter-spacing: 0.4rem;

`;

const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 40%;
  width: 100%;
  margin: 26px 0 26px;
`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  width: 60%;
  height: 2rem;
  padding: 0.5rem 2rem;
  border: none;
  outline: none;
  color: #3c354e;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
  &:focus {
    display: inline-block;
    backdrop-filter: blur(12rem);
    border-radius: 2rem;
    color: white;
    font-weight: normal;
  }
  &::placeholder {
    color: #b9abe099;
    font-weight: 100;
    font-size: 14px;
  }
`


const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button`
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  letter-spacing: 0.2rem;
  width: 74%;
  height: 2rem;
  padding: 0.5rem 2rem;
  border: none;
  color: white;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 12px;

  &:hover{
      background: linear-gradient(to right, #03217b 0%, #14163c 79%);
      transition: all 2s  linear;
}
`


const TitleContainer = styled.div`
  margin: 2rem 3.6rem 0 auto;
  button{
    cursor: pointer;
    font-size: 14px;
    font-style: italic;
    background: transparent;
    border: none;
    outline: none;
    color: rgba(255, 255, 255,0.7);

    &:hover {
        color: blue;
    }
  }
`;

export default LoginPage
