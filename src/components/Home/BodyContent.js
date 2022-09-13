import React from 'react'
import styled from 'styled-components'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { NavLink } from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
const BodyContent = (props) => {
  const Data = props.data?props.data:[]
  const screen = props.screen
  
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 2,
    slidesToShow: screen === 0 ? 5 : screen === 1 ? 3: 2
  }

  return (
        <Container className='body-content'>
            <span className='body-content-header'>{props.head}</span>
            <SLiderBody {...settings} scr = {screen}>
                {
                    Data.map(item => (
                        <div  className='body-content-item'  key={item.id}>
                          <NavLink to ={`/${props.state.content_type}/${item.id}`} className='nav-link'>
                            <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt=''/>
                            <h3>{item.original_name|| item.original_title}</h3>
                            <div className='rate'>
                                <span>{item.vote_average}</span>
                                <AiFillStar className='start'/>
                            </div>
                          </NavLink>
                        </div>
                    ))
                }
            </SLiderBody>
        </Container>

  )
}


const Container = styled.div`
    
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    
    .body-content-header{
      font-size: 24px;
      padding: 4px 0 12px 0;
    }
`


const SLiderBody = styled(Slider)`
    width: 100%;
    
    .slick-track{
      display: flex;
      justify-content: flex-start;

      .slick-slide{
        border-radius: 12px;
        margin: 10px;
      }
    }
    

    & > button {
    opacity: ${({scr}) => scr === 2 ? '1' : '0'};
    height: 100%;
    width: 5vw;
    z-index: 1;

    &:hover {
      opacity: 1;
      transition: opacity 0.2s ease 0s;
    }
  }


    .slick-prev {
      left: ${({scr}) => scr === 1 ? '-30px' : scr===0 ? '-46px' : '-26px'};
    }

    .slick-next {
      right: ${({scr}) => scr === 1 ? '-30px' : scr===0 ? '-51px' : '-20px'};
    }

    .slick-prev:before,
    .slick-next:before {
        font-size: 26px;
        opacity:0.6;
        
    }

    .body-content-item{
      width:25%;
      height: 100%;
      position: relative;
      text-align: center;
      background-color: rgba(255,255,255,0.1);
      border-radius:12px;
      transition: all 0.5s  ease-in;

      .nav-link{
        text-decoration: none;
        color: rgba(255,255,255,0.8);

        img{
        width: 100%;
        object-fit: contain;
        border-top-left-radius:12px;
        border-top-right-radius: 12px;
      }

      h3{
        font-size: 16px;
        font-weight: normal;
        word-wrap: wrap;
        margin: 0;
        margin: 8px 12px 8px 8px;
        //chinh 1 dong + ...
        line-height: 20px;
        height: 20px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient:  vertical;
        -webkit-line-clamp: 1;

      }

      .rate{
        width: 48px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,255,0.7);
        border-radius: 20px;
        position: absolute;
        top: 10px;
        right: 12px;

        span{
          margin:-3px 0 0 4px;
          font-size: 13px;
        }

        .start{
          color: yellow;
          font-size: 15px;
          margin-top:1px;
        }
      }
      }

      &:hover {
        cursor: pointer;
        transform:  scale(1.07);
        overflow: auto;
        z-index:9;
      }
      

      
    }
    
`

export default BodyContent

