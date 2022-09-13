import React from 'react'
import styled from 'styled-components'
// import { useStore } from '../../hooks'
import Movie from './Movie'
import TVShow from './TVShow'

const FilmWatchMain = ({id, type,screen}) => {

  return (
    <Container scr = {screen}>
      {
          type==='tv'
        ?
          <TVShow 
              id={id}
              screen={screen}
          /> 
        : 
          <Movie 
              id={id}
              screen={screen}
          />
      }

    </Container>
  )
}

const Container = styled.div`
    color: white;
    display: flex;
    flex: 1;
    width: 100%;
    
`

export default FilmWatchMain
