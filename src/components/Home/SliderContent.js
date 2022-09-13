import React from 'react'
import styled from 'styled-components'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import {useGetGenre} from '../../hooks'
import {useAxios} from '../../hooks'
import {instance} from '../../shared/instance'
import {FaPlay} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'


const SliderContent = (props) => {
    const type = props.state.content_type
    const screen = props.screen

    const [Data] = useAxios({
      axiosInstance: instance,
      method: 'GET',
      url: `/trending/${type}/day?api_key=${process.env.REACT_APP_API_KEY}`,
    })
    
    const [Genre] = useAxios({
      axiosInstance: instance,
      method: 'GET',
      url: `/genre/${type}/list??api_key=${process.env.REACT_APP_API_KEY}&language=en-US`,
    })

    const SliderData =  Data.results||[]
    const genre_main = Genre.genres
    
    const genre_list = useGetGenre(SliderData.map(item => item.genre_ids),genre_main)
    
    let settings = {
        dots: screen ===0 ? true : false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true
    }

    const getGenre = (index, list) => {
        for(var i=0; i< list.length; i++) {
            if(i===index) 
              return list[i]
        }
        return []
    } 

  return (
      
        <Carousel {...settings} scr = {screen} >
          {
              SliderData.map((item, index) => (
                  <Wrap key={item.id} scr = {screen}>
                      <NavLink to ={`/${type}/${item.id}`}>
                        <div className='slide-bg'></div>
                        <div className='blur'></div>
                        <img 
                            src={item.backdrop_path===null?'./images/bg-df.jpg':`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                            alt=''
                        />
                        <div className='slider-content'>
                            <span className='slider-content-header'>{item.name||item.title}</span>
                            <div className='slider-main'>
                                <span className='title'>{item.original_name||item.original_title}</span>
                                <span className='first-air'>First air date: {item.first_air_date|| item.release_date}</span>
                                <div className='genre-list'>
                                    {
                                        getGenre(index, genre_list).map((i,index) => (
                                            <div key={index} className='genre-item'>
                                              {i}
                                            </div>
                                        ))
                                    }
                                </div>
                                <p className='overview'>{item.overview}</p>
                            </div>
                        </div>
                      </NavLink>
                      <div className='slider-play' >
                          <div className='slider-icon'>
                              <FaPlay/>
                          </div>
                      </div>
                  </Wrap>
              )) 
          }
        </Carousel>
  )
}

export default SliderContent

const Carousel = styled(Slider)`
  margin-top: 20px;
  padding: 0 32px;
  
  //nút next và prev
  & > button {
    opacity: 0;
    height: 100%;
    width: 5vw;
    z-index: 1;

    &:hover {
      opacity: 1;
      transition: opacity 0.2s ease 0s;
    }
  }

  //các dấu chấm
  ul li button {
    &:before {
      font-size: 10px;
      color: rgb(150, 158, 171);
    }
  }

  //nút tròn nhỏ khi đang ở hình hiện tại
  li.slick-active button:before {
    color: white;
  }


  .slick-prev {
    left: ${({scr}) => scr === 1 ? '0px' : '-21px'};
  }

  .slick-next {
    right: ${({scr}) => scr === 1 ? '0px' : '-21px'};
  }

  @media screen and (max-width: 768px){
    padding: 0 10px;
    .slick-prev {
      left: 0px;
    }

    .slick-next {
      right: 0px;
    }
  }
`

const Wrap = styled.div`
    border-radius: 8px;
    cursor: pointer;
    position: relative;
      
    a{
        border-radius:8px;
        cursor: pointer;
        display: block;
        position: relative;
        padding: 8px;

        .slide-bg{
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-image: linear-gradient(to right, black, transparent); 
          opacity:0.8;
        }

        .blur{
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0,0,0,0.3) ;
        }

        img{
            border-radius:8px;
            width: 100%;
            height: 450px;
        }

        .slider-content{
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          margin:40px 0 40px 40px;
          width: ${({scr}) => scr >= 1 ? '70%' : '65%'};
          overflow-y: hidden;

          .slider-content-header{
              font-size: ${({scr}) => scr >= 1 ? '30px' : '42px'};
              text-transform: uppercase;
              color:rgb(8, 111, 255);
              font-weight: bold;
              word-wrap: break-word;
          }

          .slider-main{
            margin-top: 20px;
            display:flex;
            flex-direction: column;
            color:rgb(191, 191, 191);
            font-size: ${({scr}) => scr >= 1 ? '16px' : '18px'};

            .title{
              font-size: ${({scr}) => scr >= 1 ? '18px' : '20px'};
              color: white;
              text-transform: uppercase;
              padding-bottom: 10px;
              word-wrap: break-word;
            }

            .genre-list{
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
              margin-top: 20px;

              .genre-item{
                padding: 0px 10px 3px;
                border: 2px solid rgb(129, 129, 130);
                border-radius:30px;
                margin:0 12px 10px 0;
                background-color: rgba(0,0,0,0.2) ;

              }
            }

            .overview{
              margin:8px 0 0 0;
              line-height: 30px;
              height: ${({scr}) => scr !== 1 ? (scr === 2 ? '30px' :'90px') : '60px'};
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient:  vertical;
              -webkit-line-clamp: ${({scr}) => scr !== 1 ? (scr === 2 ? 1 :3) : 2};
            }
          }
        }
    }

    .slider-play{
        position:absolute;
        top:45%;
        left:45%;
        width: 65px;
        height: 65px;
        background: rgba(0,0,255,0.7);
        display: none;
        justify-content: center;
        align-items: center;
        border-radius:50%;
        font-size: 36px;
        opacity: 0;
        transition: all 3s ease-in;


        
        .slider-icon{
            margin: 5px 0 0 7px;
        }
    }
 &:hover{
        .blur{
          z-index: 10;
          background: rgba(0,0,0,0.5) ;
          transition: all 0.5s ease-in;
        }

        .slider-play{
          display: flex;
          z-index:20;
          opacity: 1;
        }
    }

    @media screen and (max-width: 900px){
      a{
        .slider-content{
          .slider-main{
            .overview{
              height: 60px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient:  vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
        
      }
    }
    
`

