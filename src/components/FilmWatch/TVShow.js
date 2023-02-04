import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useAxios, useStore} from '../../hooks'
import {instance} from '../../shared/instance'
import {FaStar} from 'react-icons/fa'
import {AiTwotoneCalendar} from 'react-icons/ai'
import {NavLink} from 'react-router-dom'
import axios from "axios"

const TVShow = ({id, screen}) => {
  const data  = useStore()

  const [Data] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`,
  })

  const seasons = Data.seasons
  const createArr = (n) => {
    const arr = []
    for(var i=1;i<=n;i++){
      arr.push(i)
    }
    return arr
  }  

  const [Recom] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/tv/${id}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
  })  

  const similar_list = Recom.results
  
  const [ep, setEp] = useState(1)
  const [season, setSeason] = useState(1)

  const handleClick = (ep, season) => {
    setEp(ep)
    setSeason(season)
  }
  const [show,setShow] = useState([])

  const n = Array.isArray(seasons) === true ? seasons.length : 0
  useEffect(() => {    
    var arr = []
    for(var i = 0; i <= n; i++)
    {
      arr[i] = false
    }
    setShow(arr)
  },[n])

  const getShow = (i) =>{
    return show[i]
  }

  const handleShow = (i) => {
      setShow(show.map((item, index) => {
        let tmp = false
        if(i===index)
          if(item === true)
            tmp=false
          else tmp = true
        return tmp
      }))
  }
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
            type: 'tv', 
            image: `https://image.tmdb.org/t/p/w185${Data.poster_path}`,
            name: Data.name,
            season: season,
            ep:ep
          },
  
          { withCredentials: true }
        )
        return {data: response.data}
      } 
      catch (error) {
          return {err: error}
      }
    }
    if(Data.name)
      addHistory()
    
  },[Data, ep, season, data, id])

  return (
    <Container scr = {screen}>
        <div className='watch'>
          <div className='watch-video'>
            <iFrame 
                src={`https://www.2embed.to/embed/tmdb/tv?id=${id}&s=${season}&e=${ep}`}
                frameborder="0" allowfullscreen
                width= {screen === 0 ? "963px" : '94%'}
                height={screen === 0 ? "542px" : screen===2? '100%' : '100%'}
            ></iFrame>
          </div>
          
          {
            !Array.isArray(Data)?
            <div className='watch-content'>
              <h2>{Data.name}</h2>
              <div className='watch-icon'>
                  <div>
                    <FaStar />
                    <span>{Data.vote_average}</span>
                  </div>
                  <div>
                    <AiTwotoneCalendar />
                    <span>{Data.first_air_date.slice(0,4)}</span>
                  </div>
              </div>
              <div className='watch-genre'>
                  {Data.genres.map((item,i) => <span key ={i}>{item.name}</span>)}
              </div>
              <div className='watch-overview'>
                 <h3>Overview:</h3>
                 <p>{Data.overview}</p>
              </div>
            </div>
            :'Loading..'
          }

        </div>
        
        {
          Array.isArray(seasons) && seasons.length ===0 ?
          <div className='recoment'>
            <h2>Seasons</h2>
            {
              Array.isArray(similar_list) && similar_list.length> 0?
              <div className ='similar-content'>
                {
                  similar_list.map(item =>(
                      <NavLink to = {`/tv/${item.id}`} className ='similar-content-item' key={item.id}>
                          <img src={item.poster_path !== null ? `https://image.tmdb.org/t/p/w342${item.poster_path}`:'/images/bg-df.jpg'} alt='' />
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
          : 
          <div className='seasons'>
              <h2>Seasons:</h2>
              {
                 Array.isArray(seasons) ?
                    <div className='seasons-main'>
                        {
                          seasons.map(item => 
                            <div 
                              className='seasons-item' 
                              key={item.id} 
                              onClick={() => {
                                handleShow(item.season_number)
                              }}
                            >
                                <div className='seasons-cnt'>
                                  <img src={item.poster_path!==null?`https://image.tmdb.org/t/p/w300/${item.poster_path}`: '/images/film.jpg'} alt='' />
                                  <div>
                                    <span>{item.name}</span>
                                    <span>Air date: {item.air_date}</span>
                                    <span>Eposode: {item.episode_count}</span>
                                  </div>
                                </div>

                                {getShow(item.season_number) && <div className='seasons-ep'>
                                  <div className='watch-ep-list'  key={item.season_number}>
                                    {
                                      createArr(item.episode_count).map((i,index) => <button  key={index} onClick={() => handleClick(i, item.season_number)}><span>{i}</span></button>)
                                    }
                                  </div>
                                </div>}
                            </div>  
                          )
                        }
                    </div>
                 :''
              }
          </div>
        }
        
    </Container>
  )
}

const Container = styled.div`
    color: white;
    display: flex;
    overflow-x: hidden;
    border-left:2px solid rgba(255,255,255,0.2);
    flex-direction: ${({scr}) => scr === 0 ? 'row' : 'column'};
    .watch{
        width: 100%;
        height:100vh;
        display: flex;
        flex-direction: column;

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
      width:330px;
      border-left: 2px solid rgba(255,255,255,0.2);
      padding: 20px 30px 20px 20px;
      h2{
        margin: 0;
      }

      .similar-content{
        margin-top: 30px;
        height: 650px;
        overflow-y: auto;
        width: 100%;
        overflow-x: hidden;

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
          margin-left: 10px;

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

    .seasons{
      width:${({scr}) => scr === 0 ? '330px' : '100%'};
      border-left: 2px solid rgba(255,255,255,0.2);
      padding: 20px 30px 20px 20px;

      .seasons-main{
        display: flex;
        flex-direction: column;
        height: ${({scr}) => scr === 0 ? '642px' : '100%'};
        overflow-y: auto;
        width: 100%;
        overflow-x: hidden;

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

        .seasons-item{
          display: flex;
          flex-direction: column;
          padding: 12px;

          &:hover{
            cursor: pointer;
            border-radius:20px;
            background: rgba(255,255,255,0.2);
          }
          .seasons-cnt{
            display: flex;
            img{
              width:100px;
              height:100px;
              object-fit: cover;
              margin-right: 10px;
            }

            div{
              display: flex;
              flex-direction: column;
              justify-content: center;
              color: rgba(255, 255, 255,0.7);
              font-size: 17px;

              span:nth-child(1){
                color: white;
              }
            }
          }


          .seasons-ep{
            transition: all 0.5s ease-in;
            .watch-ep-list{
              margin: 20px 0 0; 
              width: auto;

              button{
                margin: 0 10px 10px 0;
                font-size: 13px;
                border-radius: 50%;
                border: none;
                outline: none;
                width: 32px;
                height: 32px;
                background: rgba(255,255,255,0.4);
                color:white;

                &:hover{
                  cursor: pointer;
                  background: rgba(255,255,255,0.2);
                }
              }
            }
          }
        }
      }
    }
    
`

export default TVShow
