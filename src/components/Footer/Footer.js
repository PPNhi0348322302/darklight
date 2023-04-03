import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {BsFacebook, BsGithub} from 'react-icons/bs'
const Footer = () => {
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
    <Container>
        <SidebarLogo scr={type}>
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

        <Info scr={type}>
            <div>
                <a href="https://www.facebook.com/profile.php?id=100008705461731" >
                    <BsFacebook style={{color: 'white'}}/>
                </a>
            </div>
            {/* <div>
                <a href="https://github.com/ptynhi99">
                    <BsGithub style={{color: 'white'}}/>
                </a>
            </div> */}
        </Info>
    </Container>
  )
}

const Container = styled.div`
    height:60px;
    width: 100%;
    background: rgb(33,34,38);
    display: flex;
    align-items: center;
    justify-content: space-between;

`

const SidebarLogo = styled.div`
    display: flex;
    align-items: center;
    margin-left: 30px;

    img{
        width: ${({scr}) => scr === 2 ? '26px' : '40px'};
        height: ${({scr}) => scr === 2 ? '26px' : '40px'};
        border-radius: 50%;
        margin-right: 10px;
        margin-left: -8px;
    }

    .logo-name{
        display: flex;
        position: relative;

        .dark{
            font-size:${({scr}) => scr === 2 ? '20px' : '24px'};
            position: absolute;
            top: -22px;
            left: 0;
            font-weight: bold;
            color: rgb(6, 38, 102);
            color: ${({theme}) => theme === 'dark' ? ' rgb(6, 38, 102)' : 'rgb(0,0,255)'};
        }
        .light{
            font-size:${({scr}) => scr === 2 ? '18px' : '22px'};
            position: absolute;
            top: -11px;
            left: ${({scr}) => scr === 2 ? '46px' : '56px'};
            font-weight: 700;
            color: rgba(218, 228, 247,0.5);
        }
    }
`
const Info = styled.div`
    display: flex;
    margin-right: 30px;
    div{
        width: ${({scr}) => scr === 2 ? '26px' : '36px'};
        height: ${({scr}) => scr === 2 ? '26px' : '36px'};
        border-radius:50%;
        margin-left: 4px;
        font-size: ${({scr}) => scr === 2 ? '18px' : '26px'};
        background: rgba(0,0,0, 0.4);
        
        cursor: pointer;

        a{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`
export default Footer
