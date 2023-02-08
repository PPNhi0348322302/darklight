import React, {useState} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import {useStore} from '../../hooks'
import {actions} from '../../store'
import {useGoogleLogin} from '@react-oauth/google'
import axios from "axios"

const LoginPage = () => {
  const data  = useStore() 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState()
  let navigate = useNavigate()

  const handleRegister = () => {
    navigate('/register')
  }

  const login = async ({email, password}) => {
      
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/login`,
        {email, password},
        { withCredentials: true }
      )
      return {data: response.data}
    } 
    catch (error) {
        return {err: error}
    }
  }

  const loginWGoogle = async ({email, name, avatar}) => {
      
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user/loginWithGoogle`,
        {email, name, avatar},
        { withCredentials: true }
      )
      return {data: response.data}
    } 
    catch (error) {
        return {err: error}
    }
  }

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async response => {
        try {
            const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${response.access_token}`
                }
            })
            try{
              const info = res.data
              const rs = await loginWGoogle({email: info.email, name: info.name, avatar: info.picture})
              
              if( rs && rs.data.token ){
                data[1](actions.setUser(rs.data)) 
                data[1](actions.setLogIn(true))
                data[1](actions.setToken(res.data.accessToken))
                navigate('/')
              }
            }
            catch(err){
              console.log('err: ' + err)
              
            }
        } catch (err) {
          setError(error.message)
        }

    }
})

  const handleSubmit = async(e) => {
      e.preventDefault()
      setError()
      if(password === '' || email === '') {
          setError('Password, email does not empty')
      } else {
        try{
          const res = await login({email, password})
          
          if( res && res.data.accessToken ){
            data[1](actions.setUser(res.data)) 
            data[1](actions.setLogIn(true))
            data[1](actions.setToken(res.data.accessToken))
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
      <WelcomeText>DarkLight</WelcomeText>
      <InputContainer onSubmit = {handleSubmit}>
        <span>{error}</span>
        <StyledInput 
            type="email" 
            placeholder="Email" 
            value = {email}
            onChange={e => setEmail(e.target.value)}
        />

        <StyledInput 
            type="password" 
            placeholder="Password" 
            value = {password}
            onChange={e => setPassword(e.target.value)}
        />

        <ButtonContainer>
          <StyledButton type='submit'>Sign Up</StyledButton>
        </ButtonContainer>

      </InputContainer>

      <LoginWith>OR LOGIN WITH</LoginWith>
      <HorizontalRule />
      
      <IconsContainer>
        <button 
            className='icon'
            onClick={e=>handleGoogleSignIn(e)}
        >
            <img src='images/gg.png' alt="" />
            <span>Login with Google</span>
        </button>
      </IconsContainer>
      <TitleContainer>
        <button>Forgot Password ?</button>
        <button onClick={handleRegister}>Register Now</button>
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
    height: 60vh;
  }
  @media only screen and (min-width: 1024px) {
    width: 70vw;
    height: 50vh;
  }
  @media only screen and (min-width: 1280px) {
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
  height: 20%;
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
  margin: 1rem 0 ;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.button`
background: linear-gradient(to right, #14163c 0%, #03217b 79%);
text-transform: uppercase;
letter-spacing: 0.2rem;
width: 74%;
height: 2rem;
padding: 0.5rem 2rem;
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
  font-size: 10px;
  letter-spacing: 0.4rem;
`;

const HorizontalRule = styled.hr`
  width: 90%;
  height: 0.2rem;
  border-radius: 0.8rem;
  border: none;
  background: linear-gradient(to right, #14163c 0%, #03217b 79%);
  background-color: #ebd0d0;
  margin: 0 0 0.5rem 0;
  backdrop-filter: blur(25px);
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 0.5rem 0 1rem 0;
  width: 60%;
  border: none;

  .icon{
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:8px;
    background: rgba(255, 255, 255, 0.6);
    padding: 0.5rem 2rem;
    cursor: pointer;
    img {
        width:1.5rem;
        height:1.5rem;
    }

    span{
      margin-left: 30px;
      font-size: 14px;
      font-weight: bold;
    }
  }
  
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  button{
    cursor: pointer;
    font-size: 12px;
    font-style: italic;
    font-weight: normal;
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
