import React, {useState} from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom';
import {useStore} from '../../hooks'
import {actions} from '../../store'
import axios from "axios"
//icons: 
import {FiSettings} from "react-icons/fi"
import {AiOutlineHome, AiOutlineMenu} from "react-icons/ai"
import {IoCompassOutline} from "react-icons/io5"
import {BiSearch, BiLogInCircle, BiLogOutCircle} from "react-icons/bi"
import {MdOutlineAccountCircle, MdOutlineHistory, MdOutlineBookmarks} from "react-icons/md"
// import {HiOutlineMoon} from "react-icons/hi"
import {IoCreateOutline} from "react-icons/io5"
import { FaTimes } from 'react-icons/fa'
import { CgMenuRight } from 'react-icons/cg'
import {BiCheckCircle, BiInfoCircle, BiXCircle} from 'react-icons/bi'
import {useNavigate} from 'react-router-dom'
import Toast from './Toast'

const SideBar = ({screen}) => {
    const [state, dispatch]  = useStore()
    const [show, setShow] = useState(false)

    const MenuList = [
        {
            path:"/",
            name:"Home",
            icon: AiOutlineHome
        },
        {
            path:"/explore",
            name:"Explore",
            icon: IoCompassOutline
        },
        {
            path:"/search",
            name:"Search",
            icon: BiSearch
        },
        
    ]

    const optionList = [
        {
            path:"/profile",
            name:"Profile",
            icon: MdOutlineAccountCircle
        },
        {
            path:"/history",
            name:"History",
            icon: MdOutlineHistory
        },
        {
            path:"/bookmark",
            name:"Bookmark",
            icon: MdOutlineBookmarks
        }
    ]

    const setData = () => {
        dispatch(actions.setSearch(''))
        dispatch(actions.setOption({}))
    }

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
        showToast('warning',`You need to login to use website`)
    }

    //end toast 

    const handleShow =() => {
        setShow(!show)
    }


    return (
        <Container mb = {screen===2}>
            <HeaderMobile className='mobile-header' mb = {screen===2}>
                <NavLink to ='/'>
                    <img src='/images/logo.jpg' alt='logo' />
                </NavLink>
                <MobileIcon onClick={handleShow}>
                    {show ? <FaTimes /> : <CgMenuRight />}
                </MobileIcon>
            </HeaderMobile>
            
            <Sidebar show={show} theme = {state.theme}>
                <SidebarLogo theme = {state.theme}>
                    <img 
                        src='/images/logo.jpg'
                        alt=''
                    />
                    <div 
                        className='logo-name'
                    >
                        <span className='dark'>Dark</span>
                        <span className='light'>Light</span>
                    </div>            
                </SidebarLogo>
                
                <Headerside>
                    <div className='sidebar-main'>
                        <span className='sidebar_head' >
                            <div>{<AiOutlineMenu />}</div>
                            Menu 
                        </span>
                        <div className='sidebar_item'>
                            {
                                MenuList.map(item => (
                                    <NavLink 
                                        to =  {item.path}
                                        key={item.path} 
                                        className='item'
                                        onClick = {setData}
                                    >
                                        <div className='icon'>{<item.icon />}</div>
                                        <span>{item.name}</span>
                                    </NavLink>
                                ))
                            }
                        </div>
                    </div>

                    <div className = 'sidebar-main des-main'>
                        <span className='sidebar_head'>
                            <div>{<IoCreateOutline/>}</div>
                            PERSONAL 
                        </span>
                        <div className='sidebar_item'>
                            {
                                optionList.map(item => (
                                    <div 
                                        key={item.path} 
                                        className='item'
                                        onClick = {() => {
                                                            dispatch(actions.setOption({name:item.name, path:item.path}))
                                                            state.login===true?navigate(item.path):handleClick()
                                                        }
                                                    }
                                    >
                                        <div className='icon'>{<item.icon />}</div>
                                        <span>{item.name}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='sidebar-main des-main'>
                        <span className='sidebar_head'>
                            <div>{<FiSettings/>}</div>
                            Setting 
                        </span>

                        <div className='sidebar_item'>
                            {/* <div 
                                className='item'
                                onClick={handleTheme}
                            >
                                <div className='icon'>{state.theme ==='Dark'? <HiOutlineMoon/> : <BiSun/>}</div>
                                <span>{state.theme}</span>
                            </div> */}
                            <NavLink 
                                to = {`${state.login === false ?'/login' : '/'}`}
                                className='item'
                                onClick={ async () => {
                                        if(state.login === true){
                                            const res = await logOut()
                                            if( res && res.res ){
                                                dispatch(actions.setUser({}))
                                                dispatch(actions.setLogIn(false))
                                            }
                                        }
                                    }
                                }
                            >
                                <div className='icon'>{state.login===true?<BiLogOutCircle/> : <BiLogInCircle/>}</div>
                                <span>{state.login===true?'Logout':'Login'}</span>
                            </NavLink>   
                        </div>
                    </div>
                </Headerside>
                <Toast toastList={list} position={screen ===2 ? '1' : ''}  setList={setList}/>
            </Sidebar>
        </Container>

    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 999;
    transition: all 0.5s linear;
`
const HeaderMobile = styled.div`
    display: ${({mb}) => mb===true ? 'flex' : 'none'};
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background: rgb(255,255,255,0.1);
    img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit:cover;
        margin-left: 20px;
    }

`
const MobileIcon = styled.div`
		display: block;
		transform: translate(-100%, 60%);
		font-size: 1.8rem;
		cursor: pointer;
        margin-top: -40px;
        margin-right: 4px;
`
const Sidebar = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    width:240px;
    height: 97vh;
    background-color: rgba(3,10,37,0.6);
    background-color: ${({theme}) => theme === 'Dark' ? ' rgba(3,10,37,0.6)' : 'rgba(3,10,37,0.2)'};
    color: white;
    padding: 20px 0 0 20px;
    border-right:2px solid rgba(255,255,255,0.2);
    z-index:99;
    @media screen and (max-width: 480px) {
		position: fixed;
        height: 98vh;
		top: 0;
		left: 0;
		opacity: ${({ show }) => (show ? 1 : 0)};
		visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
		transform: translateY(${({ show }) => (show ? '0' : '-10px')});
		transition: opacity 0.5s ease;
		background-color: #071c2f;
	}

`

const SidebarLogo = styled.div`
    display: flex;
    align-items: center;

    img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
        margin-left: -8px;
    }

    .logo-name{
        display: flex;
        position: relative;

        .dark{
            font-size:30px;
            position: absolute;
            top: -22px;
            left: 0;
            font-weight: bold;
            color: rgb(6, 38, 102);
            color: ${({theme}) => theme === 'dark' ? ' rgb(6, 38, 102)' : 'rgb(0,0,255)'};
        }
        .light{
            font-size:28px;
            position: absolute;
            top: -11px;
            left: 70px;
            font-weight: 700;
            color: rgba(218, 228, 247,0.5);
        }
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
    
    .sidebar_head{
        padding: 0px 0 10px 0;
        text-transform: uppercase;
        font-size:20px;
        font-weight: 700;
        display:flex;
        align-items: center;

        div{
            padding-right: 8px;
            margin-top: 5px;
            font-size: 18px;
        }
    }

    .des-main{
        position: relative;
    }

    .des-main::before{
        content: "";
        height:4px;
        width:90%;
        background-color: rgba(128, 150, 150,0.4);
        top: -4px;
        left: 0;
        right: 0;
        position: absolute;
        border-radius: 2px;
    }

    .sidebar_item{
        
        .item{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 30px;
            font-size:17px;
            padding: 10px 0 10px 40px;
            color: rgba(213, 221, 237,0.7);
            text-decoration: none;

            span{
                line-height:30px;
                align-content: center;
                margin-top: -5px;
            }

            .icon{
                font-size:24px;
                padding-right: 20px;
            }

            &:hover{
                color: white;
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
            &::before{
                position: absolute;
                width: 4px;
                height:50%;
                background-color: rgb(0, 60, 181);
                content: '';
                right: -1px;
                top: 10px;
            }

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
