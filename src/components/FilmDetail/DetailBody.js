import React,{useState} from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import {useAxios} from '../../hooks'
import {instance} from '../../shared/instance'
import {useStore} from '../../hooks'
import {AiFillHeart} from 'react-icons/ai'
import {HiOutlineDotsHorizontal} from 'react-icons/hi'
import {GiShare} from 'react-icons/gi'
import {FaPlay} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const DetailBody = ({id, type, screen}) => {
    const data  = useStore()
    const [over, setOver] = useState(true)
    const [cast, setCast] = useState(false)
    const [review, setReview] = useState(false)
    const [seasons, setSeasons] = useState(false)
    const [isBookmark, setIsBookmark] = useState(false)

    //query data:
    //bookmark
  
    //end

    const [Data] = useAxios({
        axiosInstance: instance,
        method: 'GET',
        url: `/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}`,
      })         
      
    const totalSeaasons = Array.isArray(Data.seasons) && Data.seasons !== undefined ? Data.seasons.length:0
    const totalEp =Array.isArray(Data.seasons) && Data.seasons !== undefined?
                   Data.seasons.reduce((sum, curr) => curr.episode_count + sum,0) :0
    
    const total = {
      seasons: totalSeaasons,
      ep: totalEp
    }
    
    const [credits] = useAxios({
      axiosInstance: instance,
      method: 'GET',
      url: `/${type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`,
    })

    const Cast = credits.cast

    const [Review] = useAxios({
      axiosInstance: instance,
      method: 'GET',
      url: `/${type}/${id}/reviews?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
    })

    const [Media] = useAxios({
      axiosInstance: instance,
      method: 'GET',
      url: `/${type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`,
    })
    

    const handleClick = (type) =>{
        switch(type){
          case 'over':
              setOver(true)
              setCast(false)
              setSeasons(false)
              setReview(false)
              break
          case 'cast':
              setOver(false)
              setCast(true)
              setSeasons(false)
              setReview(false)
            break
          case 'review':
              setOver(false)
              setCast(false)
              setSeasons(false)
              setReview(true)
            break
          case 'seasons':
              setOver(false)
              setCast(false)
              setSeasons(true)
              setReview(false)
            break
          default:
              setOver(true)
              setCast(false)
              setSeasons(false)
              setReview(false)
              break
        }
    }

    const Update = (strDate) =>{
        const Date = strDate.slice(0, strDate.indexOf('T'))
        return Date
    }

    const sliceURL = (url) => {
      if(typeof url === 'string' || url)
        {
          const res = url.slice(1, url.length)
          return res
        }
        return ''
    }

    const urlCheck = (str) => {
        return str ===null ||str.indexOf('https') >=0 ? false : true
    }
    
  if( Data.length!==0)  
    return (
      <Container scr = {screen}>
          <div className='detail-bg'>
              <img  src={`https://image.tmdb.org/t/p/w1280${Data.backdrop_path}`} alt='' />
              <div className='slide-bg'></div>
              <div className='blur'></div>
              <div 
                className='detail-icon'
                onClick={() => {
                    if(data[0].login ===true)
                      {if(isBookmark === true)
                        {
                          console.log('Delete bookmark');
                          
                          setIsBookmark(false)
                        }
                      else
                        {
                          console.log('Create bookmark');
                          setIsBookmark(true)
                        }}
                  }
                }
              >
                  <AiFillHeart className={`icon-item ${isBookmark===true ? 'active' : ''}`}/>
                  <GiShare className='icon-item'/>
                  <HiOutlineDotsHorizontal className='icon-item'/>
              </div>
          </div>

          <div className='detail-header'>
              <img  src={`https://image.tmdb.org/t/p/w185${Data.poster_path}`} alt='' />
              <div className='detail-header-name'>
                  <span className='detail-header-title'>{Data.name||Data.title}</span>
                  <div className='detail-header-genre'>
                      {Data.genres.map(item =><span key={item.id}>{item.name}</span>)}
                  </div>
                  
              </div>
              <NavLink 
                to ={`/${type}/watch/${id}`} 
                className='detail-header-watch'
                onClick={() => {
                      if(data[0].login ===true)
                      console.log('Create bookmark');
                    }
                  }
              >
                  <FaPlay className='icon'/>
                  <span>WATCH</span>
              </NavLink>
          </div>
          <div className ='detail-content'>
              {screen !==2 && <div className='detail-content-data'>
                  <div className='rating'>
                      <span 
                        className='head'
                        style={{marginLeft:'10px'}}
                      >RATING</span>
                      <div className='vote'>
                          <svg
                              className="svg"
                              width='80'
                              height='80'
                          >
                              <circle
                                  className="svg-circle-bg"
                                  cx= '40'
                                  cy = '40'
                                  r='36'
                                  stroke='#d9edfe'
                                  strokeWidth='8'
                              />
                              <circle
                                  className="svg-circle"
                                  cx= '40'
                                  cy = '40'
                                  r='36'
                                  stroke='rgba(0,0,255,0.8)'
                                  strokeWidth='8'
                                  strokeDasharray='226'
                                  strokeDashoffset={ ((100 - Data.vote_average*10) / 100) * 226}
                              />
                              <text 
                                  className="svg-circle-text">
                                      {Data.vote_average}%
                              </text>
                          </svg>
                          <div className = 'vote-average'><span>{Data.vote_average}</span></div>
                      </div>
                  </div>
                  <div className='length'>
                      <span className='head'>EP LENGTH</span>
                      <div>
                        <span>{Data.runtime || (Data.episode_run_time && Data.episode_run_time[0])||'0'}</span>
                        min
                      </div>
                  </div>
              </div>}
              <div className='detail-content-view'>
                  <div className='detail-view-nav'>
                      <div 
                          onClick={() =>handleClick('over')} 
                          className= {`detail-view-item ${over&&'active'}`}
                      >
                          Overall
                      </div>
                      <div 
                          onClick={() =>handleClick('cast')} 
                          className= {`detail-view-item ${cast&&'active'}`}
                      >
                          Cast
                      </div>
                      <div 
                          onClick={() =>handleClick('review')} 
                          className= {`detail-view-item ${review&&'active'}`}
                      >
                          Reviews
                      </div>
                      {data[0].content_type==='tv'?
                          <div 
                              onClick={() =>handleClick('seasons')} 
                              className= {`detail-view-item ${seasons&&'active'}`}
                          >
                              Seasons
                          </div>
                          :''
                      }
                  </div>

                  <div className='detail-view-content'>
                      {over && 
                        <div className='overall'>
                            <span className='overall-tag'>{Data.tagline}</span>
                            <div className='overall-main'>
                                <h3>STORY</h3>
                                <span>{Data.overview}</span>
                                <h3>DETAILS</h3>
                                <span>Status: {Data.status}</span>
                                {Data.last_air_date?
                                  <span>Last air date: {Data.last_air_date}</span>:
                                  <span>Release date: {Data.release_date}</span>
                                }
                                <span>Spoken language: {Data.spoken_languages.map(item =>item.english_name + ',')}</span>
                            </div>
                        </div>
                      }

                      {cast && 
                        <div className="cast">
                            {Cast.slice(0,8).map(item => (
                                <div className="cast-item" key={item.id}>
                                    <img src={`https://image.tmdb.org/t/p/w300${item.profile_path}`} alt='' />
                                    <div>
                                        <span>{item.original_name}</span>
                                        <span>as {item.character}</span>
                                    </div>
                                </div>
                            ))}
                        </div> 
                      }

                      {review && 
                          <div className='review'>
                              {
                                <div className='review-content'>
                                      <div className='review-head'>
                                          <span>Sort Rating:</span>
                                          <select className='sort-select'>
                                              <option>Descending</option>
                                              <option>Ascending</option>
                                          </select>
                                      </div>
                                      <div className='review-cmt'>
                                          {
                                            Review.results.length===0?
                                            <div className='no-review'>
                                                <span>There are no reviews yet</span>
                                            </div>: 
                                              Review.results.map(item => (
                                                  <div className='review-cmt-item' key={item.id}>
                                                      <img 
                                                        src=
                                                        { 
                                                          urlCheck(item.author_details.avatar_path)?
                                                          `https://image.tmdb.org/t/p/w300/${item.author_details.avatar_path}`
                                                          :item.author_details.avatar_path!==null?`${sliceURL(item.author_details.avatar_path)}`:'/images/default-avatar.png'
                                                        } 
                                                        alt=''
                                                      />
                                                      <div className='cmt-item-info'>
                                                          <span>{item.author_details.username}</span>
                                                          <p>{item.content}</p>
                                                          <span>{Update(item.updated_at)}</span>
                                                      </div>
                                                  </div>
                                              ))
                                            
                                          }
                                      </div>
                                </div>
                              }
                          </div>
                      }

                      {seasons && 
                        <div className='seasons'>
                            <div className='seasons-head'>
                              <span>Total seasons: {total.seasons}</span>
                              <span>Total episodes: {total.ep}</span>
                            </div>
                            <div className='seasons-content'>
                                {
                                  Data.seasons.map(season => (
                                    <div className='seasons-item' key = {season.id}>
                                        <div className='seasons-item-left'>
                                          <img src={`https://image.tmdb.org/t/p/w300/${season.poster_path}`} alt=''/>
                                          <div className='seasons-item-info'>
                                              <span>{season.name}</span>
                                              <span>{season.air_date}</span>
                                          </div>
                                        </div>
                                        <div className='seasons-item-right'>
                                            <span>{season.episode_count} episodes</span>
                                        </div>
                                    </div>
                                  ))
                                }
                            </div>
                        </div>
                      }
                  </div>
              </div>
              <div className='detail-content-media'>
                <span>MEDIA</span>
                <div className='media-content'>
                  {
                    Array.isArray(Media.results) && 
                    Media.results.map(item => (
                      <div className='media-item' key={item.key}>
                        <ReactPlayer 
                          url={`https://www.youtube.com/embed/${item.key}`}
                          controls={true}
                          width={screen===1?"160px":'252px'}
                          height="142px"
                        ></ReactPlayer>
                        <span className='media-item-name'>{item.name}</span>
                      </div>
                    ))
                  }
                </div>
                
              </div>
          </div>
      </Container>
    )
  else return (
    <div>Loading...</div>
  )
}

const Container = styled.div`
    flex: 1;
    border-right: 2px solid rgba(255,255,255,0.2);
    position: relative;
    border-left:2px solid rgba(255,255,255,0.2);
    overflow-x: hidden;


    .detail-bg{
        position: relative;
        width: 100%;
        height:400px;
        color: white;
        
        img{
          height: 100%;
          width: 100%;
          object-fit: cover;
          border-bottom-left-radius:16px;
          border-bottom-right-radius:16px;
        }

        .slide-bg{
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              background-image: linear-gradient(to right, black, transparent); 
              opacity:0.8;
              border-bottom-left-radius:16px;
              border-bottom-right-radius:16px;
            }

        .blur{
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0,0,0,0.3) ;
          border-bottom-left-radius:16px;
          border-bottom-right-radius:16px;
        }

        .detail-icon{
          display: flex;
          position: absolute;
          top: 20px;
          right: 30px;
          padding-right: 20px;
          
          .icon-item{
              margin-left: 10px;
              font-size: ${({scr}) => scr !== 0 ? '20px' : '26px'};
              border-radius: 50%;
              padding:8px;
              border: 3px solid rgba(255,255,255,0.8);
              background: rgba(0,0,0,0.5);

              &:hover{
                cursor: pointer;
                color: rgba(0,0,255,0.6);
                background: rgba(0,0,0,0.2);
                border-color: rgba(0,0,255,0.6);
              }
          }

          .active{
            color: rgba(0,0,255,0.6);
            background: rgba(0,0,0,0.2);
          }
        }
      }

    .detail-header{
      display: flex;
      flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
      position: absolute;
      width: 100%;
      height: auto;
      top: ${({scr}) => scr === 2 ? '100px' : '220px'};
      left: 0;
      padding-left: ${({scr}) => scr === 0 ? '60px' : '20px'};
      z-index:2;

      img{
          width:${({scr}) => scr === 2 ? '200px' : 'auto'};
          border-radius: 12px;
          box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.4);
      }

      .detail-header-name{
          display: flex;
          flex-direction: column;
          flex: 1 1;
          margin:0 50px 10px 60px;
          margin-left: ${({scr}) => scr ===2 ? '10px' : '60px'};

          .detail-header-title{
            font-size: ${({scr}) => scr !== 0 ? '30px' : '40px'};
            font-weight: bold;
            padding-right: ${({scr}) => scr === 1 ? '10px' : '0'};
          }

          .detail-header-genre{
            display: flex;
            flex-wrap: wrap;
            margin-top:16px;

            span{
              font-size: ${({scr}) => scr !== 0 ? '14px' : '16px'};
              padding: 5px 18px 8px;
              border-radius:20px;
              margin:4px 10px 0 0;
              border: 2px solid rgba(255, 255, 255, 0.4);
            }
          }
      }

      .detail-header-watch{
          position:absolute;
          /* top: 115px; */
          top: ${({scr}) => scr === 1 ? '200px' : '115px'};
          right: ${({scr}) => scr === 2 ? '40px' : '100px'};
          padding:10px 20px;
          border-radius: 28px;
          background: rgb(0,0,255);
          display: flex;
          align-items: center;
          transition: all 0.5s  ease-in;
          color: white;
          text-decoration: none;
          /* margin-left: ${({scr}) => scr === 2 ? '40px' : '0'}; */

          .icon{
              font-size: 20px;
          }

          span{
            font-size: 18px;
            padding-left: 6px;
          }

          &:hover{
            cursor: pointer;
            background: rgb(74, 104, 255);
          }
      }
    }

    .detail-content{
      display: flex;
      flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
      overflow-y: auto;
      max-height:${({scr}) => scr !== 0 ? 'auto' : '345px'};
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



      .detail-content-data{
        width: 150px;
        display: flex;
        flex-direction: column;
        position: relative;
        align-items: center;
        padding: 200px 0 40px 0;

      
        .head{
            font-size: ${({scr}) => scr !== 0 ? '14px' : '18px'};
            text-align: center; 
        }

        &::before{
          position: absolute;
          width:2px;
          height:76%;
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          top: 90px;
          right: 0;
          content:'';
        }

        .rating{
            position: relative;
            .svg{
                display: block;
                margin: 20px auto;
                max-width: 100%;
            }
              
            .svg-circle-bg {
                fill: none;
            }
              
            .svg-circle {
                fill: none;
            }

            .svg-circle-text {
                font-size: 2rem;
                text-anchor: middle;
                fill: #fff;
                font-weight: bold;
            }

            .vote{
                width: 80px;
                height: 80px;
                position: relative;
                
                  .vote-average{
                    color:  rgba(255, 255, 255,0.6);
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${({scr}) => scr !== 0 ? '16px' : '20px'};
                  }
            }
        }   
        
        .length{
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            div{
              font-size: 17px;
              margin-left: 4px;
              margin-top: 6px;
              span{
                color:  rgba(255, 255, 255,0.6);
                font-size: ${({scr}) => scr !==0 ? '20px' : '24px'};
                margin-right: 10px;
              }
            }
        }
      }

      .detail-content-view{
          flex: 1;
          display: flex;
          align-items: center;
          flex-direction: column;
          margin:${({scr}) => scr === 2 ? '50% 0 0 20px' :scr === 1 ? '16% 0 0 20px' : '0'};
          padding:   ${({scr}) => scr === 1 ? '28px 10px 28px 0' : scr===2? '28px 10px' :'28px 64px'};
          z-index:999;
          .detail-view-nav{
            display: flex;
            position: relative;
            margin-left: ${({scr}) => scr === 0 ? '50px' : '0'};
            
            .detail-view-item{
              font-size: ${({scr}) => scr !== 0 ? '16px' : '20px'};
              margin-right: 36px;
              color: rgba(255, 255, 255,0.6);
              transition: all 0.5s  ease-in;
              cursor: pointer;
            }

            .active{
                  color: white;
                  border-bottom: 2px solid rgba(0,0,255,0.8);
                  margin-top: -10px;
              }
          }

          .detail-view-content{
              margin-top: ${({scr}) => scr !== 0 ? '2px' : '60px'};
              width: 100%;

              .overall{
                transition: all 1s  linear;
                  .overall-tag{
                      width: 100%;
                      display: flex;
                      justify-content:center;
                      color: rgba(255,255,255,0.6);
                      font-style: italic;
                      font-size: 18px;
                  }

                  .overall-main{
                      display: flex;
                      flex-direction: column;
                      font-size: ${({scr}) => scr !== 0 ? '15px' : '17px'};

                      h3{
                        margin-bottom: 10px;
                      }

                      span{
                          color: rgba(255,255,255,0.6);
                          line-height: 30px;
                      }
                  }
              }

              .cast{
                  display: flex;
                  flex-wrap: wrap;
                  margin-left: 20px;
                  transition: all 1s  linear;

                  .cast-item{
                    display: flex;
                    width: ${({scr}) => scr !== 0 ? '100%' : '46%'};
                    align-items: center;
                    margin: 30px 20px 0 0;
                    
                    img{
                      width:65px;
                      height:65px;
                      object-fit: cover;
                      border-radius: 50%;
                    }

                    div{
                      display: flex;
                      flex-direction: column;
                      margin-left: 20px;
                      color: rgba(255,255,255,0.6);

                      span:first-child{
                          color: rgba(0,0,255,0.8);
                          font-size: ${({scr}) => scr !== 0 ? '15px' : '17px'};
                      }
                    }
                  }
              }

              .review{
                transition: all 1s  linear;
                font-size: ${({scr}) => scr !== 0 ? '15px' : '18px'};
                width: 100%;
                color: rgba(255,255,255,0.7);

                .review-content{
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    

                    .review-head{
                      display: flex;
                      justify-content: center;
                      margin-left:auto;
                      align-items: center;

                      span{
                        margin-right: 12px;
                      }
                      
                      select{
                        background: transparent;
                        color: rgba(255,255,255,0.7);
                        font-size: ${({scr}) => scr !== 0 ? '15px' : '18px'};
                        border: none;
                        cursor: pointer;
                        
                        option{
                          margin-top: 12px;
                          color: rgba(255,255,255,0.7);
                          font-size: ${({scr}) => scr !== 0 ? '15px' : '18px'};
                          background: rgba(0,0,0,0.7);
                          
                        }
                      }

                      
                    }

                    .review-cmt{
                      margin-top: 40px;
                      display: flex;
                      height: 280px;
                      flex-direction: column;
                      overflow-y: auto;
                      width: 100%;

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

                      .no-review{
                        width: 100%;
                        display: flex;
                        justify-content: center;

                      }

                      .review-cmt-item{
                        display: flex;
                        margin-bottom: 20px;

                        img{
                          width: 60px;
                          height: 60px;
                          object-fit: cover;
                          border-radius: 50%;
                          border: 2px solid rgba(255, 255, 255, 0.2);
                        }

                        .cmt-item-info{
                          width: 100%;
                          margin-left: 20px;
                          color: rgba(255,255,255,0.7);

                          span:nth-child(1){
                            color: white;
                          }

                          p{
                            line-height: 30px;
                            margin: 8px 0;
                            height: 90px;
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-box-orient:  vertical;
                            -webkit-line-clamp: 3;
                          }

                          span:nth-child(3){
                            width: 100%;
                            display: flex;
                            justify-content: flex-end;
                          }
                        }
                      }
                    }
                }
              }

              .seasons{
                  .seasons-head{
                    color:  rgba(255,255,255,0.7);
                    font-size: ${({scr}) => scr !== 0 ? '15px' : '18px'};
                    display: flex;
                    justify-content: space-between;
                    
                  }

                  .seasons-content{
                      margin-top: 30px;
                      overflow-y: auto;
                      overflow-x: hidden;

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

                      .seasons-item{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
                        margin-bottom: 20px;

                        .seasons-item-left{
                          display: flex;
                          align-items: center;

                          img{
                            width: 120px;
                            border-radius: 12px;
                            margin-right: 16px;
                          }

                          .seasons-item-info{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            font-size: ${({scr}) => scr !== 0 ? '14px' : '17px'};
                            color: rgba(255,255,255,0.7);

                            span:nth-child(1) {
                                color:white;
                                margin-bottom: 20px;
                            }

                          }
                        }

                        .seasons-item-right{
                          font-size: ${({scr}) => scr !== 0 ? '14px' : '17px'};
                          color: rgba(255,255,255,0.7);
                        }
                      }
                  }
              }
          }
      }

      .detail-content-media{
          width: ${({scr}) => scr === 2 ? '100%' : scr===0 ? '300px' : '240px'};
          border-left: 1px solid rgba(255,255,255,0.2);
          padding-top: ${({scr}) => scr === 1 ? '120px' : '28px'};
          max-height: 440px;
          span{
            font-size: ${({scr}) => scr !== 0 ? '17px' : '20px'};
            color:white;
            font-weight: bold;
            padding-left: 20px;
          }

          .media-content{
            display: flex;
            flex-direction: column;
            align-items: ${({scr}) => scr === 1 ? 'flex-start' : 'center'};
            padding: 12px 10px 0 20px;
            overflow-y: auto;
            height: ${({scr}) => scr !== 0 ? '100%' : '440px'};

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

            .media-item{
              margin-bottom: 20px;

              span{
                font-size: ${({scr}) => scr !== 0 ? '15px' : '18px'};
                padding-left: 0;
                font-weight: normal;
                color: rgba(255,255,255,0.6);
                padding-top:10px;
                line-height: 20px;
                height: 20px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient:  vertical;
                -webkit-line-clamp: 1;
              }
            }
          }

      }
    }
`

export default DetailBody
