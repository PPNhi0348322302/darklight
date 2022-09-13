import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { TabTitle } from '../store/Genera'
import SideBar from '../components/Comon/SideBar'
import Sidebarmini from '../components/Comon/Sidebarmini'
import ExploreContent from '../components/Explore/ExploreContent'
const Explore = () => {
  TabTitle('Explore | DarkLight')
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
      {type === 1 ? <Sidebarmini /> : <SideBar screen = {type}/>}
      <ExploreContent screen = {type}/>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
  color: #fff;

`
export default Explore
