import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'
import SideBar from '../Comon/SideBar'
import Sidebarmini from '../Comon/Sidebarmini'
import FilmWatchMain from './FilmWatchMain'
import { useAxios } from '../../hooks'
import { instance } from '../../shared/instance'
import { TabTitle } from '../../store/Genera'

const FilmWatch = () => {
  const [screen, setScreen] = useState(window.innerWidth <=480 ? 2 : window.innerWidth <=900 ? 1 :0)

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

  const {id, type} = useParams()
  const [Data] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}`,
  })
  TabTitle(`${Data.name ||Data.title} | DarkLight`)
  return (
    <Container scr = {screen}>
        {screen ===2 ? <SideBar screen = {screen}/> : <Sidebarmini />}
        <FilmWatchMain 
          id={id}
          type = {type}
          screen = {screen}
        />
    </Container>
  )
}

const Container = styled.div`
    color: white;
    display: flex;
    flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
    height: 100%;
`

export default FilmWatch
