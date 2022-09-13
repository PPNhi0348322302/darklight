import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Content from '../components/Home/Content'
import SearchBox from '../components/Comon/SearchBox'
import SideBar from '../components/Comon/SideBar'

import Sidebarmini from '../components/Comon/Sidebarmini'
const Home = () => {
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
    <Container  scr = {type}>
        {type===1 && <Sidebarmini /> }
        {(type===0 || type=== 2) && <SideBar screen = {type} />}
        <Content screen = {type} />
        {type===0 && <SearchBox/>}
    </Container>
  )
}

const Container = styled.div`
    display:flex;
    flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
    height: 100vh;
`

export default Home
