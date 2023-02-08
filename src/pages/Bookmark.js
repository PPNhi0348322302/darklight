import React, {useState,useEffect, useRef} from 'react'
import styled from 'styled-components'
import { TabTitle } from '../store/Genera'
import SideBar from '../components/Comon/SideBar'
import Sidebarmini from '../components/Comon/Sidebarmini'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from "axios"
import {useStore} from '../hooks'
import {MdDelete} from 'react-icons/md'
import {refreshToken, actions} from '../store'

const Bookmark = () => {
  const [Bookmark, setBookmark] = useState([])
  const [typeBookmark, setTypeBookmark] = useState('all')
  const [reRender, setReRender] = useState(false)
  const data  = useStore()
  TabTitle('Bookmark | DarkLight')
  let navigate = useNavigate()
  const effectRan = useRef(false)
  
  //get data bookmark
  useEffect(() => {   
    const getBookmark =  async () => { 
      await axios.get(
        `${process.env.REACT_APP_BASE_URL}/personal/bookmark`,
          {params: {
            id: data[0].user._id,
            type: typeBookmark
          }},  
          {
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : data[0].token
            }
          },
          
          { withCredentials: true }
      )
      .then(response => {
        setBookmark(response.data)
      })
      .catch( async err => {
        if(err.request.status === 403) {
          await refreshToken()
          .then(response => {
            data[1](actions.setToken(response.accessToken))
          })
          .catch( err => {
            data[1](actions.setUser(null)) 
            data[1](actions.setLogIn(false))
            data[1](actions.setToken(''))
            navigate('/login')
          })
        }
        
      })
      
    }
    if (effectRan.current === true ) {
      getBookmark()
    }
    return () => {
      effectRan.current = true
    }
    
  },[reRender, typeBookmark]);

  const delBookmark = async (id, type) => {
    try 
    {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/personal/bookmark`,
        {
          data: 
          {
            idUser: data[0].user._id, 
            idMovie: id, 
            type
          }
        },        
        { withCredentials: true }
      )
      return {data: response.data}
    } 
    catch (error) {
        return {err: error}
    }
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
      <BookmarkContent>
        <Headerside scr = {type}>
          <div className='content-head'>
            <span>YOUR BOOKMARK</span>
          </div>
          <div className='content-type'>
            <button 
                onClick={() => {
                  setTypeBookmark('all')
                }}
                className={typeBookmark ==='all'?'active':''}
            >
                All
            </button>
            <button 
              onClick={() => {setTypeBookmark('tv')}       }
              className={typeBookmark ==='tv'?'active':''}
            >
                TV Show
            </button>
            <button 
              onClick={() => {setTypeBookmark('movie')}}
              className={typeBookmark ==='movie'?'active':''}
            >
                Movie
            </button>
          </div>
        </Headerside>

        <HisBody scr = {type}>
            {
              Array.isArray(Bookmark) && Bookmark.length === 0? <span>Not found</span>:
              Bookmark.map(item => (
                <div  className='body-content-item'  key={item._id}>
                  <div 
                    className='delete-bookmark'
                    onClick={ async () => {
                      const rs  = await delBookmark(item.idMovie, item.type)
                      setReRender(!reRender)
                      return rs
                    }}
                  >
                    <MdDelete color='rgb(0,60,181)'/>
                  </div>
                  <NavLink to ={`/${item.type}/${item.idMovie}`} className='nav-link'>
                    <img src={`https://image.tmdb.org/t/p/w342${item.imageMovie}`} alt=''/>
                    <h3>{item.name}</h3>
                  </NavLink>
                </div>
              ))
            }
        </HisBody>

      </BookmarkContent>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
  height: calc(100vh - 60px);
  color: #fff;
  
`

const BookmarkContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 94%;
  margin: 32px 0 30px 32px;
  overflow-y: auto;
  &::-webkit-scrollbar{
    width: 0px;
    height: 40px;
  }

  &::-webkit-scrollbar-track{
    border-radius: 50px;
    background-color: rgba(255,255,255,0.2);
    margin-left: 10px;
  }

  &::-webkit-scrollbar-thumb{
    border-radius: 50px;
    background-color: rgb(18,18,18);
  }
`
const Headerside = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 42px;
  margin-bottom: 40px;


  .content-head{
    display: flex;
    justify-content:space-between;
    align-items: center;
    margin-bottom: 20px;

    span{
      font-size: ${({scr}) => scr === 2 ? '20px' : '30px'};
      color: #fff;
      font-weight: bold;
    }
  }

  .content-type{
      margin-bottom: 20px;
      button{
        background: transparent;
        font-size: ${({scr}) => scr === 2 ? '16px' : '18px'};
        color: rgba(255,255,255,0.7);
        margin-right: 20px;
        border: none;
        outline: none;
        position: relative;
        transition: all 0.5s  linear;
        cursor: pointer;

        &:hover{
          color: #fff;
        }
      }

      .active::before{
          content:'';
          position: absolute;
          bottom: -8px;
          left: 2px;
          width: 100%;
          height: 4px;
          background: rgb(0,0,255);
          transition: all 0.5s  linear;
      }
  }

  
`

const HisBody = styled.div`
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    
    .body-content-item{
      margin: 8px 16px;
      width: ${({scr}) => scr === 2 ? '40%' : '18%'};
      position: relative;
      text-align: center;
      background-color: rgba(255,255,255,0.1);
      border-radius:12px;
      transition: all 0.5s  ease-in;
      position: relative;

      .delete-bookmark{
        position: absolute;
        top: 10px;
        right: 10px;
        display: ${({scr}) => scr === 0 ? 'none' : 'flex'};
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        background: ${({scr}) => scr === 0 ? 'rgba(255,255,255,0.4)' : 'white'};
        font-size: 16px;
        transition: all 0.5s ease-in;
      }

      .nav-link{
        text-decoration: none;
        color: rgba(255,255,255,0.8);

        img{
        width: 100%;
        object-fit: contain;
        border-top-left-radius:12px;
        border-top-right-radius: 12px;
      }

      h3{
        font-size: 16px;
        font-weight: normal;
        word-wrap: wrap;
        margin: 0;
        margin: 8px 12px 8px 8px;
        //chinh 1 dong + ...
        line-height: 20px;
        height: 20px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient:  vertical;
        -webkit-line-clamp: 1;

      }

      }

      &:hover {
        cursor: pointer;
        transform:  scale(1.07);
        overflow: auto;
        z-index:9;

        .delete-bookmark{
          display: flex;
        }
      }
      

      
    }
`
export default Bookmark
