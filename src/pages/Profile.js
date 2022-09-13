import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import SideBar from '../components/Comon/SideBar'
import Sidebarmini from '../components/Comon/Sidebarmini'
import { TabTitle } from '../store/Genera'
import {useAuth} from '../shared/AuthContext'
const Profile = () => {
  TabTitle('Profile | DarkLight')
  const {currentUser, updateUserPassword} = useAuth()
  const [password, setPassword] = useState()
  const [error, setError] = useState()
  const [success, setSuccess] = useState()

  const handleSubmit = async(e) => {
    e.preventDefault()
    await updateUserPassword(currentUser, password).then((res) => {
        setSuccess('Password updated success')
    }).catch((err) => {
        setError(err.message)
    })
  } 

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
  },[])

  
  return (
    <Container scr = {type}>
      {type ===1 ? <Sidebarmini /> : <SideBar screen = {type}/>}
      <ProfileContent>
        {
          currentUser===null ?
          <span>You are not logged in</span>:
          <Prof scr = {type}>
              <h2>Profile Page</h2>
              <div className='avatar'>
                { currentUser.photoURL !== null ? <img src={currentUser.photoURL} alt="" /> : <img src='./images/default-avatar.png' alt="" />}
              </div>
              <div className='info'>
                  <span>Name:  {currentUser.displayName||'Default'}</span>
                  <span>Email:  {currentUser.email}</span>
                  <span>Change Password:  </span>
                  <form className='form-change' onSubmit={handleSubmit}>
                      <input 
                          type='password' 
                          placeholder='New Password'
                          value = {password}
                          onChange={e => setPassword(e.target.value)}
                      ></input>
                      <button type='submit'>Update</button>
                  </form>
                  <span>{success||error}</span>
              </div>
          </Prof>
        }
      </ProfileContent>

      
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  color: #fff;
  flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
`

const ProfileContent = styled.div`
  height: calc(100vh - 60px);
`

const Prof = styled.div `
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding:20px 0;

    h2{
      font-size: 24px;
      padding:0 40px 16px;
      color: rgba(255, 255, 255,0.7);
      border-bottom: 1px solid rgba(255, 255, 255,0.2);
    }

    .avatar{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;


        img{
          width:280px;
          height:280px;
          border-radius: 50%;
          margin-bottom: 20px;
          object-fit: cover;
        }
    }
    

    .info{
      display: flex;
      flex-direction: column;
      font-size: 20px;
      padding: 20px 40px 0;

      span{
        line-height: 50px;
      }

      .form-change{
        display: flex;
        width: 100%;
        
        flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
        input{
          flex: 1;
          max-width:${({scr}) => scr === 2 ? '100%' : '520px'};
          height:40px;
          border-radius: 20px;
          border: none;
          outline: none;
          background: rgba(255, 255, 255, 0.1);
          padding:4px 32px;
          margin-right: 20px;
          color: #fff;
          font-size: 16px;
          letter-spacing: 0.4rem;

          &:placeholder{
            color: white;
            letter-spacing: 0.2rem;
          }

          &:focus{
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(12rem);
          }
        }

        button{
          border: none;
          outline: none;
          height:40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          color: #fff;
          font-size: 15px;
          padding:8px 26px;
          margin-top: ${({scr}) => scr === 2 ? '10px' : '0'};
          width: ${({scr}) => scr === 2 ? '100%' : 'auto'};
          &:hover{
            cursor: pointer;
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }

    }
`
export default Profile
