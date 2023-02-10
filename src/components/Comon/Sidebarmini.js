import React, {useState} from 'react'
import styled from 'styled-components'
import {NavLink, useNavigate} from 'react-router-dom';
import {useStore} from '../../hooks'
import {actions} from '../../store'
import axios from "axios"
import Toast from './Toast'

//icons: 
import {AiOutlineHome} from "react-icons/ai"
import {IoCompassOutline} from "react-icons/io5"
import {BiSearch, BiLogInCircle, BiLogOutCircle} from "react-icons/bi"
import {MdOutlineAccountCircle, MdOutlineHistory, MdOutlineBookmarks} from "react-icons/md"
// import {HiOutlineMoon} from "react-icons/hi"
import {BiCheckCircle, BiInfoCircle, BiXCircle} from 'react-icons/bi'


const SideBar = () => {
    const [state, dispatch]  = useStore()

    const MenuList = [
        {
            path:"/",
            icon: AiOutlineHome
        },
        {
            path:"/explore",
            icon: IoCompassOutline
        },
        {
            path:"/search",
            icon: BiSearch
        },
        {
            path:"/profile",
            icon: MdOutlineAccountCircle,
            name:"Profile"
        },
        {
            path:"/history",
            icon: MdOutlineHistory,
            name:"History"
        },
        {
            path:"/bookmark",
            icon: MdOutlineBookmarks,
            name:"Bookmark"
        }
    ]

    const logOut = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/user/logout`,
            {},
            {
                withCredentials: true,
                headers: {
                'Content-Type': 'application/json',
                'Authorization' : ''
                },
              },
          )
          return {res: response.data}
        } 
        catch (error) {
            return {error: error}
        }
      }


    // const handleTheme = () => {
    //     if (state.theme === 'Dark'){
    //         dispatch(actions.setTheme('Light'))
    //     }
    //     else {
    //         dispatch(actions.setTheme('Dark'))          
    //     }
        
    // }

    //Toast
    let navigate = useNavigate()
    const [list, setList] = useState([])
    let toastProperties = null

    const showToast = (type, des) => {
        switch(type) {
        case 'success':
            toastProperties = {
                id: list.length+1,
                icon: <BiCheckCircle className='icon' style={{ backgroundColor: '#5cb85c' }}/>,
                title: 'Success',
                description: des,
                backgroundColor: '#5cb85c'
            }
            break;
        case 'warning':
            toastProperties = {
                id: list.length+1,
                icon: <BiInfoCircle className='icon' style={{ backgroundColor: '#f0ad4e' }}/>,
                title: 'Warning',
                description: des,
                backgroundColor: '#f0ad4e'
            }
            break;
        case 'danger':
            toastProperties = {
                id: list.length+1,
                icon: <BiXCircle className='icon' style={{ backgroundColor: '#d9534f' }}/>,
                title: 'Danger',
                description: 'This is a danger toast component',
                backgroundColor: '#d9534f'
            }
            break;
        default:
            toastProperties = [];
        }
        setList([...list, toastProperties]);
    }

    const handleClick =() => {
        <Toast toastList={list}  setList={setList}/>
        showToast('warning',`You need to login to use ${state.option.name}`)
    }

    //end toast 

    return (
        <Sidebar>
            <SidebarLogo>
                <NavLink to = '/'>
                    <img 
                        src='/images/logo.jpg'
                        alt=''
                    />   
                </NavLink>  
            </SidebarLogo>

            <Headerside>
                <div className='sidebar-main'>
                    <div className='sidebar_item'>
                        {
                            MenuList.map(item => (
                                <div 
                                    key={item.path} 
                                    className='item'
                                    onClick = {() => {
                                        if(item.name){
                                            dispatch(actions.setOption({name:item.name, path:item.path}))
                                            state.login===true?navigate(item.path):handleClick()
                                        }
                                        else navigate(item.path)
                                        }
                                    }
                                >
                                    <div className='icon'>{<item.icon />}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='sidebar_item'>
                        {/* <div 
                            className='item'
                            onClick={handleTheme}
                        >
                            <div className='icon'>{state.theme ==='Dark'? <HiOutlineMoon/> : <BiSun/>}</div>
                        </div> */}
                        <NavLink 
                            to = {`${state.login === false ?'/login' : '/'}`}
                            className='item'
                            onClick={ async () => {
                                    if(state.login === true){
                                        const res = await logOut()
                                        if( res && res.res ){
                                            dispatch(actions.setUser(null))
                                            dispatch(actions.setLogIn(false))
                                        }
                                    }
                                }
                            }
                        >
                            <div className='icon'>{state.login===true?<BiLogOutCircle/> : <BiLogInCircle/>}</div>
                        </NavLink>    
                    </div>
                </div>
            </Headerside>
            <Toast toastList={list}  setList={setList}/>

        </Sidebar>
    )
}


const Sidebar = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width:80px;
    height: 100%;
    background-color: rgba(28,28,30,0.4);
    color: white;
    padding: 40px 0 0 0;
`

const SidebarLogo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 60px;
    cursor: pointer;
    img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

`
const Headerside = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    .sidebar-main{
        position: relative;
        padding: 20px 0;
    }
    

    .sidebar_item{
        .item{
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 30px;
            font-size:17px;
            color: rgba(213, 221, 237,0.7);
            text-decoration: none;

            .icon{
                font-size:26px;
            }

            &:hover{
                color: rgb(0, 60, 181);
                cursor: pointer;

                span, .icon{
                    transition: all 0.5s ease-in;
                    transform:  scale(1.1);
                }

            }
        }

        button{
            background: transparent;
            border: none;
            height: 50px!important;

        }

        .active{
            position: relative;
            color: rgb(0, 60, 181);
            :hover{
                span, .icon{
                    transform:  none;
                    color: rgb(0, 60, 181);
                }
            }
        }
    }

    
`
export default SideBar
