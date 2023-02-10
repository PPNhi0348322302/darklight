import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import {useAxios, useStore} from '../../hooks'
import {instance} from '../../shared/instance'
import {FaStar} from 'react-icons/fa'
import {AiTwotoneCalendar} from 'react-icons/ai'
import {NavLink} from 'react-router-dom'
import axios from "axios"

const Movie = ({id, screen}) => {
  const data  = useStore()
  const effectRan = useRef(false)
  
  const [Data] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`,
  })

  const [Recom] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/movie/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
  })  
  const similar_list = Recom.results

  useEffect(() => {
    const addHistory = async () => {
      if(data[0].login === false)
        return
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/personal/history`,
          {
            idUser: data[0].user._id, 
            idMovie: id, 
            type: 'movie', 
            image: `https://image.tmdb.org/t/p/w185${Data.poster_path}`,
            name: Data.title,
            season: '0',
            ep:0
          },
          {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : data[0].token
            },
          },
        )
        return {data: response.data}
      } 
      catch (error) {
          return {err: error}
      }
    }
    if (effectRan.current === true && Data.title) {
      addHistory()
      effectRan.current = false
    }
    return () => {
      effectRan.current = true
    }
  },[Data.title])
  
  return (
    <Container scr = {screen}>
        <div className='watch' >
          <div className='watch-video'>
            <iFrame 
                src={`https://www.2embed.to/embed/tmdb/movie?id=${id}`}
                frameborder="0" allowfullscreen
                width= {screen === 0 ? "963px" : '94%'}
                height={screen === 0 ? "542px" : screen===2? '100%' : '100%'}
            ></iFrame>
          </div>
          {
            !Array.isArray(Data)?
            <div className='watch-content'>
              <h2>{Data.title}</h2>
              <div className='watch-icon'>
                  <div>
                    <FaStar />
                    <span>{Data.vote_average}</span>
                  </div>
                  <div>
                    <AiTwotoneCalendar />
                    <span>{Data.release_date.slice(0,4)}</span>
                  </div>
              </div>
              <div className='watch-genre'>
                  {Data.genres.map((item, index) => <span key={index}>{item.name}</span>)}
              </div>
              <div className='watch-overview'>
                 <h3>Overview:</h3>
                 <p>{Data.overview}</p>
              </div>
            </div>
            :'Loading..'
          }
        </div>

        <div className='recoment'>
          <h2>Similar</h2>
          {
            Array.isArray(similar_list) && similar_list.length> 0?
            <div className ='similar-content'>
              {
                similar_list.map(item =>(
                    <NavLink to = {`/tv/${item.id}`} className ='similar-content-item' key={item.id}>
                        <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt='' />
                        <div className ='similar-content-info'>
                            <span className='similar-content-info-head'>{item.name|| item.title}</span>
                            <span className ='similar-content-info-date'>{item.first_air_date|| item.release_date}</span>
                            <div className='rate'>
                                <span>{item.vote_average}</span>
                                <FaStar className='start'/>
                            </div>
                        </div>
                    </NavLink>
                ))
              }
            </div>
            : ''
          }
        </div>
    </Container>
  )
}

const Container = styled.div`
    color: white;
    display: flex;
    border-left:2px solid rgba(255,255,255,0.2);
    overflow-x: hidden;
    flex-direction: ${({scr}) => scr === 0 ? 'row' : 'column'};

    .watch{
      /* padding: 20px 20px 0; */
        width: 100%;
        &::-webkit-scrollbar{
          width: 0px;
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
        flex: 1;
        overflow-y: auto;
        .watch-video{
          width: ${({scr}) => scr === 0 ? "963px" : '100%'};
          height:${({scr}) => scr === 0 ? "542px" : scr===1? '300px':'220px'};
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }

      .watch-content{
        padding: 20px 40px;

        h2{
          font-size: 30px;
          margin: 0;
          margin-bottom:10px;
        }

        .watch-icon{
          display: flex;

          div{
            display: flex;
            align-items: center;
            margin-right: 30px;
            font-size: 18px;
            color:rgb(0, 0, 255);

            span{
               margin-left:10px;
               color: rgba(255, 255, 255,0.7);
               font-size: 17px;
            }
          }
        }

        .watch-genre{
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          margin-top: 10px;

          span{
            padding: 6px 20px;
            background: rgba(255, 255, 255, 0.1);
            margin-right: 12px;
            border-radius: 30px;
            color: rgba(255, 255, 255,0.7);
          }
        }

        .watch-overview{
            h3{
              font-size: 18px;
              margin:20px 0 10px 0;
            }

            p{
              margin: 0;
              color: rgba(255, 255, 255,0.7);
              font-size: 17px;
              display: flex;
              flex-wrap: wrap;
              line-height:28px;
            }
        }
      }
    }

    .recoment{
      width:${({scr}) => scr !== 0 ? '100%' : '300px'};
      border-left: 2px solid rgba(255,255,255,0.2);
      padding: 20px 30px 20px 20px;
      df
      h2{
        margin: 0;
      }

      .similar-content{
        margin-top: 30px;
        height: 650px;
        overflow-y: auto;
        width: 100%;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;

        &::-webkit-scrollbar{
          width: 0px;
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
          margin: 0 0 10px 10px;
          width: 300px;

          &:hover {
            transform: scale(1.05);
            transition: all 0.5s  ease-in;
          }

          img{
            width: 160px;
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            margin-right: 10px;
          }

          .similar-content-info{
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;

            .similar-content-info-head{
              line-height: 20px;
              /* height: 40px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient:  vertical;
              -webkit-line-clamp: 2; */
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

      }
    }
    
`

export default Movie
