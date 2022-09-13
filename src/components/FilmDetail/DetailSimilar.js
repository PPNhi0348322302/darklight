import React from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import {useAxios} from '../../hooks'
import {instance} from '../../shared/instance'
import {AiFillStar} from 'react-icons/ai'

const DetailSimilar = ({id,type, screen}) => {
  const [Data] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/${type}/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
  }) 
  
  
  const [Trend] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/trending/${type}/day?api_key=${process.env.REACT_APP_API_KEY}`,
  })
  
  const similar_list = Array.isArray(Data.results) && Data.results.length ===0 ?  Trend.results : Data.results
  

  
  return (
    <Container scr = {screen}>
       <h2>{Array.isArray(Data.results) && Data.results.length ===0?'Trending': 'Similar'}</h2>
        {
          Array.isArray(similar_list) && similar_list.length> 0?
          <div className ='similar-content'>
            {
              similar_list.map(item =>(
                  <NavLink to = {`/${type}/${item.id}`} className ='similar-content-item' key={item.id}>
                      <img src={item.poster_path!==null ?`https://image.tmdb.org/t/p/w342${item.poster_path}`:'/images/film.jpg'} alt='' />
                      <div className ='similar-content-info'>
                          <span className='similar-content-info-head'>{item.name|| item.title}</span>
                          <span className ='similar-content-info-date'>{item.first_air_date|| item.release_date}</span>
                          <div className='rate'>
                              <span>{item.vote_average}</span>
                              <AiFillStar className='start'/>
                          </div>
                      </div>
                  </NavLink>
              ))
            }
            
          </div>
          : ''
        }
    </Container>
  )
}

const Container = styled.div`
    width: ${({scr}) => scr !== 0 ? '100%' : '300px'};
    margin: 40px 0px 0px 20px;

    h2{
      margin: 0;
    }

    .similar-content{
      margin-top: 30px;
      height:  ${({scr}) => scr === 2 ? '100%' : '640px'};
      overflow-y: auto;
      width: 100%;
      overflow-x: hidden;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      align-items: center;
      &::-webkit-scrollbar{
        width: 8px;
        height: 40px;
      }

      &::-webkit-scrollbar-track{
        border-radius: 50px;
        background-color: rgba(255,255,255,0.2);
        margin-left: 10px;
      }

      &::-webkit-scrollbar-thumb{
        border-radius: 50px;
        background-color: rgb(18,18,18);
      }

      .similar-content-item{
        display: flex;
        align-items: center;
        margin-bottom:20px;
        text-decoration: none;
        color: rgba(255,255,255,0.7);
        font-size: 18px;
        margin-left: 10px;
        width: ${({scr}) => scr === 1 ? '50%' : '100%'};

        &:hover {
          transform: scale(1.05);
          transition: all 0.5s  ease-in;
        }

        img{
          width: 100px;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          margin-right: 10px;
        }

        .similar-content-info{
          display: flex;
          flex-direction: column;
          position: relative;
          padding-right: ${({scr}) => scr === 2 ? '20px' : '0'};


          .similar-content-info-head{
            line-height: 20px;
            height: 40px;
            width: 100%;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient:  vertical;
            -webkit-line-clamp: 2;
          }

          .similar-content-info-date{
            margin:12px 0;
          }

          .rate{
            width: 60px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgb(0,0,255);
            border-radius: 20px;
            position: absolute;
            bottom: -20px;
            left: 0px;

            span{
              margin:-3px 0 0 4px;
              font-size: 13px;
              color: white;
            }

            .start{
              color: yellow;
              font-size: 15px;
              margin-top:1px;
            }
          }
        }
        
      }

      .load-more{
        width: 100%;
        margin: 20px 0;
        display: flex;
        justify-content: center;
        align-items: center;

        button{
          width:180px;
          height:36px;
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          border-radius: 24px;

          &:hover{
            background: rgba(255,255,255,0.1);
          }
        }
      }
    }
`
export default DetailSimilar