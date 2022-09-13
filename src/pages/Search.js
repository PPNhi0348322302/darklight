import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import SideBar from '../components/Comon/SideBar'
import SearchDT from '../components/SearchPage/SearchDT'
import Sidebarmini from '../components/Comon/Sidebarmini'
import { TabTitle } from '../store/Genera'

const Search = () => {
  TabTitle('Search | DarkLight')
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
      {type === 1? <Sidebarmini /> :<SideBar screen = {type}/>}
      <SearchDT screen = {type}/>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  color: #fff;
  flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
`

export default Search
