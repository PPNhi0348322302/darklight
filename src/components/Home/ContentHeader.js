import React, { useRef} from 'react'
import styled from 'styled-components'
import {actions} from '../../store'
import { useStore } from '../../hooks'
import { useNavigate } from 'react-router-dom'
const ContentHeader = (props) => {
    const data = useStore()
    const refTV = useRef()
    const refMovie = useRef()
    let navigate = useNavigate()
    const currentUser = data[0].user && data[0].user._id ? data[0].user : null
    
    const handleClick = (e) => {
        if(!e.current.classList.contains('active'))
        {
            if(e.current === refTV.current)
            {
                props.dispatch(actions.setContentType('tv'))
                refMovie.current.classList.remove('active')
                e.current.classList.add('active')
            }
            else
            {
                props.dispatch(actions.setContentType('movie'))
                refTV.current.classList.remove('active')
                e.current.classList.add('active')
            }
        }
        
    }
  return (
    <div>
        <CTHeader >
            <div className = 'Content-type'>
                <span 
                    className={data[0].content_type==='tv' ? 'active': undefined} 
                    onClick={() =>handleClick(refTV)}
                    ref = {refTV}
                >
                    TV Show
                </span>
                <span 
                    className={data[0].content_type==='movie' ? 'active': undefined}
                    onClick={() => handleClick(refMovie)} 
                    ref = {refMovie}
                >
                    Movie
                </span>
            </div>
            <div 
                className = {`Content-account ${data[0].login ===false ? 'disabled' :''}`}
                onClick={() => {
                    if(data[0].login ===true) 
                        navigate('/profile')
                }}
            >
                { currentUser!==null && currentUser.name!== null ?  <span>{currentUser.name}</span> : ''}
                { currentUser!==null && currentUser.avatar!== null ? <img src={currentUser.avatar} alt="" /> : <img src='./images/default-avatar.png' alt="" />}
            </div>
        </CTHeader>
    </div>
  )
}

const CTHeader = styled.div`
    padding: 0 32px 0 60px;
    display: flex;
    justify-content: space-between;
    height: 60px;
    border-bottom:1px solid rgba(255, 255, 255,0.1);
    align-items: center;
    

    .Content-type{
        position: relative;
        span{
            font-size:18px;
            padding-right:20px;
            cursor: pointer;
        }
        .active{
            position: relative;

            &::before{
                content:'';
                position: absolute;
                bottom: -17px;
                left: -4px;
                height: 3px;
                width: calc(100% - 8px);
                background: rgb(14, 7, 140);
                border-radius:2px;
                transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
            }
        }

    }

    .Content-account{
        height: 100%;
        display: flex;
        align-items: center;
        text-decoration: none;
        cursor: pointer;
        img{
            width: 28px;
            height: 28px;
            border-radius: 50%;
        }

        span{
            color:  rgba(255, 255, 255,0.6);
            margin-right: 10px;
        }
    }

    .disabled{
        cursor: not-allowed;
    }
`

export default ContentHeader
