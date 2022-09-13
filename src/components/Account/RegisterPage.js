import React, {useState} from 'react'
import styled from 'styled-components'
import { Icon} from './part'
import { FaFacebookF } from "react-icons/fa"
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../shared/AuthContext'
const LoginPage = () => {
    const FacebookBackground ="linear-gradient(to right, #0546A0 0%, #0546A0 40%, #663FB6 100%)";
    let navigate = useNavigate()
    const handleLogin = () => {
        navigate('/login')
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState()

    //lay ham register:
    const {register} = useAuth()

    const handleSubmit = async(e) => {
      e.preventDefault()
      setError()
      if(password !== confirmPassword){
          setError('Password does not match')
      } else {
          await register(email, password).then((res) => {
              navigate('/login')
          }).catch((err) => {
              setError(err.message)
          })
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



      <LoginWith>OR REGISTER WITH</LoginWith>
      <HorizontalRule />
      
      <IconsContainer>
        <Icon color={FacebookBackground}>
          <FaFacebookF />
        </Icon>
        <div className='icon'>
            <img src='images/gg.png' alt="" />
        </div>
      </IconsContainer>
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
  height: 85vh;
  width: 30vw;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 10px;
  color: #ffffff;
  @media only screen and (max-width: 320px) {
    width: 80vw;
    height: 90vh;
    hr {
      margin-bottom: 0.3rem;
    }
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 360px) {
    width: 80vw;
    height: 90vh;
    h4 {
      font-size: small;
    }
  }
  @media only screen and (min-width: 411px) {
    width: 80vw;
    height: 90vh;
  }
  @media only screen and (min-width: 768px) {
    width: 80vw;
    height: 80vh;
  }
  @media only screen and (min-width: 1024px) {
    width: 70vw;
    height: 50vh;
  }
  @media only screen and (min-width: 1280px) {
    width: 30vw;
    height: 80vh;
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
  height: 20%;
  width: 100%;
  margin-top: 60px;
  Input{
    margin-bottom: 20px;
  }

`;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  width: 80%;
  height: 3rem;
  padding: 1rem;
  border: none;
  outline: none;
  color: #3c354e;
  font-size: 1rem;
  font-weight: bold;
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
    font-size: 1rem;
  }
`

const ButtonContainer = styled.div`
  margin: 1rem 0 0rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledButton = styled.button`
background: linear-gradient(to right, #14163c 0%, #03217b 79%);
text-transform: uppercase;
letter-spacing: 0.2rem;
width: 65%;
height: 3rem;
border: none;
color: white;
border-radius: 2rem;
cursor: pointer;

&:hover{
    background: linear-gradient(to right, #03217b 0%, #14163c 79%);
    transition: all 2s  linear;
}
`

const LoginWith = styled.h5`
  font-weight: normal;
  font-size: 17px;
  letter-spacing: 0.4rem;
  margin-top: 100px;
`;

const HorizontalRule = styled.hr`
  width: 90%;
  height: 0.3rem;
  border-radius: 0.8rem;
  border: none;
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  background-color: #ebd0d0;
  margin: 0 0 1rem 0;
  backdrop-filter: blur(25px);
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 1rem 0 1rem 0;
  width: 60%;

  .icon{
    height: 3.5rem;
    width: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:50%;
    background: white;
    cursor: pointer;
    img {
        width:50%;
        height:50%;
    }
  }
  
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 80%;
  button{
    cursor: pointer;
    font-size: 17px;
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
