import React from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom';
import {useStore} from '../../hooks'
// import {actions} from '../../store'
import {useAuth} from '../../shared/AuthContext'
import { useNavigate } from 'react-router-dom';
//icons: 
import {AiOutlineHome} from "react-icons/ai"
import {IoCompassOutline} from "react-icons/io5"
import {BiSearch, BiLogInCircle, BiLogOutCircle} from "react-icons/bi"
import {MdOutlineAccountCircle, MdOutlineHistory, MdOutlineBookmarks} from "react-icons/md"
// import {HiOutlineMoon} from "react-icons/hi"


const SideBar = () => {
    const [state]  = useStore()
    const {logout} = useAuth()
    let navigate = useNavigate()
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


    // const handleTheme = () => {
    //     if (state.theme === 'Dark'){
    //         dispatch(actions.setTheme('Light'))
    //     }
    //     else {
    //         dispatch(actions.setTheme('Dark'))          
    //     }
        
    // }

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
                                <NavLink to = {item.path} key={item.path} className='item'>
                                    <div className='icon'>{<item.icon />}</div>
                                </NavLink>
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
                        <div 
                            className='item'
                            onClick= {() => {
                                logout()
                                navigate('/login')
                            }
                        }
                        >
                            <div className='icon'>{state.login===true?<BiLogOutCircle/> : <BiLogInCircle/>}</div>
                        </div>   
                    </div>
                </div>
            </Headerside>
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
