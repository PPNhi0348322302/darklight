import React from 'react'
import styled from 'styled-components'

const Empty = ({screen}) => {
  return (
    <Container scr = {screen}>
        <span className='stroke-text'>Find movies, TV shows</span>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${({scr}) => scr === 2 ? 'calc(100vh - 120px)' : '100%'};
    font-size: ${({scr}) => scr === 2 ? '20px' : '40px'};
    color: orange;
    letter-spacing: 1px;
`

export default Empty
