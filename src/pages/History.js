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

const History = () => {
  TabTitle('History | DarkLight')
  const [history, setHistory] = useState([])
  const [typeHistory, setTypeHistory] = useState('all')
  const [reRender, setReRender] = useState(false)
  const data  = useStore()
  const effectRan = useRef(false)
  let navigate = useNavigate()


  useEffect(() => {   
     
    const getHistory =  async () => { 
      
      await axios.get(
        `${process.env.REACT_APP_BASE_URL}/personal/history`,
          {params: {
            id: data[0].user._id,
            type: typeHistory
          }},
          {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : data[0].token
            },
          },
      )
      .then(response => {
        setHistory(response.data)
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
        
      });
      
    }
    if (effectRan.current === true ) {
      getHistory()
    }
    return () => {
      effectRan.current = true
    }
    
  },[reRender, typeHistory]);

  const delHistory = async (id, path) => {
    try 
    {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/personal/${path}`,
        {
          data: 
          {
            id,
            type : typeHistory
          }
        },        
        {
          withCredentials: true,
          headers: {
          'Content-Type': 'application/json',
          'Authorization' : data[0].token
          },
        },
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
  },[window.innerWidth])
  
  return (
    <Container scr = {type}>
      {type ===1 ? <Sidebarmini /> : <SideBar screen = {type}/>}
      <HistoryContent scr = {type}>
      <HeaderSide>
          <div className='content-head'>
            <span>YOUR HISTORY</span>
          </div>
          <div className='content-option'>
            <div className='content-type'>
              <button 
                  onClick={() => {
                    setTypeHistory('all')
                  }}
                  className={typeHistory ==='all'?'active':''}
              >
                  All
              </button>
              <button 
                onClick={() => {setTypeHistory('tv')}       }
                className={typeHistory ==='tv'?'active':''}
              >
                  TV Show
              </button>
              <button 
                onClick={() => {setTypeHistory('movie')}}
                className={typeHistory ==='movie'?'active':''}
              >
                  Movie
              </button>
            </div>
            {
            Array.isArray(history) && history.length === 0? '':
            <div >
              <button 
                  onClick={ async () => {
                    const rs  = await delHistory(data[0].user._id, 'historyALl')
                    setReRender(!reRender)
                    return rs
                  }}
                  className='deleteAll'
              >
                  Delete All
                  <MdDelete className='del-icon' color='rgb(0,60,181)'/>
              </button>
            </div>
            }
          </div>
        </HeaderSide>

        <HisBody scr = {type}>
            {
              Array.isArray(history) && history.length === 0? <span>Not found</span>:
              history.map((item, index) => (
                <div  className='body-content-item'  key={index}>
                  <div 
                    className='delete-bookmark'
                    onClick={ async () => {
                      const rs  = await delHistory(item._id, 'history')
                      setReRender(!reRender)
                      return rs
                    }}
                  >
                    <MdDelete color='rgb(0,60,181)'/>
                  </div>
                  <NavLink to ={`/${item.type}/${item.idMovie}`} className='nav-link'>
                    <img src={`https://image.tmdb.org/t/p/w342${item.imageMovie}`} alt=''/>
                    <div className='his-item'>
                      <div className='item-title'>
                        <h3>Header: {item.name}</h3>
                        <span>Time: {item.timeWatch}</span>
                      </div>
                      <div className='item-end'>
                        <h3>Type: {item.type === 'tv'? "TV Show" : "Movie"}</h3>
                        <span>{item.type === 'tv'? 'Season: '+item.season : ''}</span>
                        <span>{item.type === 'tv'? 'Episode: '+item.ep : ''}</span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            }
        </HisBody>

      </HistoryContent>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
  width: 100%;
  color: #fff;
  height: calc(100vh - 60px);

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

const HistoryContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 94%;
  margin: 32px 0 0 32px;
  margin: ${({scr}) => scr === 2 ? '10px' : '32px 0 0 32px'};
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
const HeaderSide = styled.div`
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
      font-size: ${({scr}) => scr === 0 ? '30px' : '24px'};
      color: #fff;
      font-weight: bold;
    }
  }

  .content-option{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .deleteAll{
        background: transparent;
        font-size: ${({scr}) => scr === 0 ? '18px' : '16px'};
        color: rgba(255,255,255,0.7);
        margin-right: 20px;
        border: none;
        outline: none;
        position: relative;
        transition: all 0.5s  linear;
        cursor: pointer;
        display: flex;
        align-items: center;

        &:hover{
          color: #fff;
          transform: scale(1.05);
        }

        .del-icon{
          margin: -2px 0 0 4px;
        }
    }
  }
  .content-type{
      button{
        background: transparent;
        font-size: ${({scr}) => scr === 0 ? '18px' : '16px'};
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
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: ${({scr}) => scr === 2 ? 'center' : 'flex-start'};
    flex-wrap: wrap;
    .body-content-item{
      width: 94%;
      margin: 8px 16px;
      position: relative;
      background-color: rgba(255,255,255,0.1);
      border-radius:12px;
      transition: all 0.5s  ease-in;

      .delete-bookmark{
        position: absolute;
        top: 50%;
        bottom: 50%;
        transform: translateY(-50%);
        right: ${({scr}) => scr === 2 ? '6px' : '10px'};
        display: ${({scr}) => scr === 0 ? 'none' : 'flex'};
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255,255,255,0.4);
        font-size: 16px;
        transition: all 0.5s ease-in;
      }

      .nav-link{
        text-decoration: none;
        color: rgba(255,255,255,0.8);
        display: flex;
        justify-content: flex-start;

        img{
          width: 32%;
          height: 160px;
          object-fit: cover;
          border-radius: 12px;
          padding: 8px;
        }

        h3{
          font-size: 17px;
          font-weight: bold;
          word-wrap: wrap;
          color: var(--primary-color);
          //chinh 1 dong + ...
          line-height: 20px;
          height: 20px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient:  vertical;
          -webkit-line-clamp: 1;
          margin: 0 0 6px;
        }

        .his-item{
          display: flex;
          flex-direction: ${({scr}) => scr === 0 ? 'row' : 'column'};
          margin: ${({scr}) => scr === 2 ? '0 0 4px 10px' : '2% 10% 0'};;
          width: 100%;
          margin: 26px 10px 0;

          .item-title{
            display: flex;
            flex-direction: column;
            flex: ${({scr}) => scr === 2 ? '1' : '4'};
  
            span{
              font-size: 15px;
              line-height: 20px;
              height: 20px;
            }
          }
  
          .item-end{
            flex: ${({scr}) => scr === 2 ? '2' : '1'};
            display: flex;
            flex-direction: column;
            span{
              line-height: 20px;
              height: 20px;
              margin-bottom: ${({scr}) => scr === 2 ? '4px' : '10px'};
            }
            
          }
        }


      }

      &:hover {
        cursor: pointer;
        transform:  scale(1.02);
        overflow: auto;
        z-index:9;

        .delete-bookmark{
          display: flex;
        }
      }
      
      
    }
`
export default History
