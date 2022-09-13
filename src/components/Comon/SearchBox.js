import React from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import {useAxios} from '../../hooks'
import {instance} from '../../shared/instance'
import {useStore} from '../../hooks'
import {AiFillStar} from 'react-icons/ai'

const SearchBox = () => {
  const data = useStore()
  const [genre, error, loading] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/genre/${data[0].content_type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`,
  })

  const [Data] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/trending/${data[0].content_type}/day?api_key=${process.env.REACT_APP_API_KEY}`,
  })

  const trend = Data.results ||[]
  
  const genre_list = genre.genres
  
  
  return (
    <Container>
        {/* <div className='search'>
          <BiSearch className='search-icon' />
          <input
              className='search-box'
              placeholder='Search...'
          />
        </div> */}
        <h2>Genre</h2>
        <div className ='search-genre'>
          {loading && <p>Loading...</p>}

          {!loading && error && <p className="errMsg">{error}</p>}

          {!loading && !error && genre_list && genre_list.slice(0,7).map((genre,index) =><span key={index}>{genre.name}</span>)}

          {!loading && !error && !genre_list && <p>No genre to display</p>}
        </div>
        <div className ='trending'>
            <h3>Trending</h3>
            <div className ='trending-content'>
                {
                  trend.slice(0,2).map(item => (
                    <NavLink to ={`/${data[0].content_type}/${item.id}`} className ='trending-content-item' key={item.id}>
                      <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt=''/>
                      <div className ='trending-content-right'>
                          <span className ='trending-item-header'>{item.name || item.title}</span>
                          <span className='trending-item-date'>{item.first_air_date || item.release_date}</span>
                          <div className='rate'>
                              <span>{item.vote_average}</span>
                              <AiFillStar className='start'/>
                          </div>
                      </div>
                    </NavLink>
                  ))
                }
            </div>
            <NavLink to = '/explore'>
                <button className='btn'>
                  <span>See more</span>
                </button>
            </NavLink>
        </div>
    </Container>
  )
}

const Container = styled.div`
    width: 240px;
    background-color:white;
    padding: 20px 20px 0 10px;
    background-color: rgba(3,10,37,0.6);
    border-left:2px solid rgba(255,255,255,0.2);

    .search{
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(255,255,255,0.3);
        //padding: 4px;
        border-radius:20px;
        width: 100%;
        height:30px;

        .search-icon{
            margin-right: 10px;
            font-size: 20px;
            color: rgba(255,255,255,0.6);
        }

        .search-box{
          border: none;
          background: transparent;
          font-size: 16px;
          outline: none;
          color: rgba(255,255,255,0.8);

          &::placeholder{
            font-size: 14px;
            color: rgba(255,255,255,0.6);
          
          }
        }
    }

    .search-genre{
      display: flex;
      flex-wrap: wrap;
      margin-top: 16px;
      //height: 180px;

      span{
          border-radius:26px;
          padding: 8px 12px 10px;
          margin:4px 10px;
          font-size: 14px;
          font-weight: 500;
          color:rgba(255,255,255,0.8);
          background: rgb(51,51,53);
      }
      
    }

    .trending{
        margin-top: 20px;
        color:rgba(255,255,255,0.6);
        
        h3{
          font-size: 20px;
          font-weight: 500;
          margin: 0;
        }

        .trending-content-item{
            display: flex;
            margin-bottom: 20px;
            margin-top: 12px;
            text-decoration: none;
            color: rgba(255,255,255,0.7);

            img{
              width: 46%;
              border-radius: 12px;
              margin-right: 16px;
            }

            .trending-content-right{
              display: flex;
              flex-direction: column;
              margin-top: 16px;

              .trending-item-header{
                line-height: 30px;
                height: 60px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient:  vertical;
                -webkit-line-clamp: 2;
                margin-bottom: 4px;
              }

              .rate{
                margin-top: 12px;
                width: 62px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,255,0.7);
                border-radius: 20px;

                span{
                  margin:-1px 0 0 3px;
                  font-size: 15px;
                  color: rgba(255,255,255,0.9);
                }

                .start{
                  color: yellow;
                  font-size: 16px;
                  margin-left:2px;
                }
              }
            }

            &:hover{
              cursor: pointer;
            }

        }

        .btn{
          width: 100%;
          height:36px;
          border-radius: 20px;
          background-color: rgb(51,51,53);
          cursor: pointer;

          span{
              font-size: 17px;
              color:rgba(255,255,255,0.6)
          }

          &:hover{
            transition: all 0.5s ease-in;
            background-color: rgba(51,51,53,0.6);
          }
        }
    }

    
`

export default SearchBox
