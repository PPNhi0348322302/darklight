import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useParams} from 'react-router-dom'
import { TabTitle } from '../../store/Genera'
import Sidebarmini from '../Comon/Sidebarmini'
import SideBar from '../Comon/SideBar'
import DetailBody from './DetailBody'
import DetailSimilar from './DetailSimilar'
import { useAxios } from '../../hooks'
import { instance } from '../../shared/instance'
const Detail = () => {
  const {type,id} = useParams()
  const [screen, setScreen] = useState(window.innerWidth <=480 ? 2 : window.innerWidth <=900 ? 1 :0)
  const [Data] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}`,
  })
  TabTitle(`${Data.name ||Data.title} | DarkLight`)

  useEffect(() => {
    const handleResize = () => {
      
      if(window.innerWidth <= 480)
        setScreen(2)
      else if(window.innerWidth <= 900)
        setScreen(1)
      else setScreen(0)
    }

    window.addEventListener("resize", handleResize)

    return () => window.addEventListener("resize", handleResize)
  },[])

  return (
    <Container scr = {screen}>
        {screen ===2 ? <SideBar screen = {screen}/> : <Sidebarmini />}
       <Body scr = {screen}>
          <DetailBody 
            id ={id}
            type = {type}
            screen = {screen}
          />
          <DetailSimilar 
            id = {id}
            type = {type}
            screen = {screen}
          />
        </Body> 
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
    background-color: rgb(28,28,30);
    height: 100%;
    overflow-x: hidden;
`

const Body = styled.div`
  display: flex;
  width: 100%;
  flex-direction: ${({scr}) => scr !== 0 ? 'column' : 'row'};
`

export default Detail


