import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import { useStore } from '../../hooks'
import {actions} from '../../store'
// import {useAxios} from '../../hooks'
// import {instance} from '../../shared/instance'
import {NavLink} from 'react-router-dom'
import {BiChevronDown, BiChevronRight} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
import ReactPaginate from "react-paginate";

const ExploreContent = ({screen}) => {
  const [open, setOpen] = useState(false)
  const [state, dispatch] = useStore()
  const [sortType, setSortType] = useState('popular')
  const option = useRef('') 
  //paginate
  const [Data, setData] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const effectRan = useRef(false)

  let limit = 10
  useEffect(() => {
    const getList = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${state.content_type}/${sortType}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      const data = await res.json()
      const total = data.total_pages
      setPageCount(Math.ceil(total / limit))
      setData(data.results)
      
    }
    if (effectRan.current === true ) {
      getList()
    }
    return () => {
      effectRan.current = true
    }
  }, [limit, sortType, state.content_type])

  const fetchComments = async (currentPage) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${state.content_type}/${sortType}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${currentPage}`
    )
    const data = await res.json()
    return data
  }

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1

    const commentsFormServer = await fetchComments(currentPage)

    setData(commentsFormServer.results)
  }

  const ChangeOption = () => {
    setSortType(option.current.value)
    setPageCount(0)
  }
  
  const handleType = (type) => 
  {
    dispatch(actions.setContentType(type))
    setPageCount(0)
  }
  
  return (
    <Container>
      <Content scr = {screen}>
        <div className='content-head'>
          <span>FIND FILMS THAT BEST FIT YOU</span>
        </div>
        <div className='content-type'>
          <button 
            onClick={() => handleType('tv')}
            className={state.content_type ==='tv'?'active':''}
          >
              TV Show
          </button>
          <button 
            onClick={() => handleType('movie')}
            className={state.content_type ==='movie'?'active':''}
          >
              Movie
          </button>
          {screen !==0 && 
            <Sortmini>
                {
                  !open?
                  <div className='sort-results' >
                    <select ref = {option} className='sort-select' onClick={ChangeOption}>
                        <option value={'popular'}>Popular</option>
                        <option value = {'top_rated'}>Top rated</option>
                        <option value = {state.content_type==='movie'?'upcoming' :'airing_today'}>On the air</option>
                    </select>
                </div>:''
                }
                  
            </Sortmini>}
        </div>
        <div className ='content-body'>
          {
            Array.isArray(Data)?Data.map(item => (
              <div  className='body-content-item'  key={item.id}>
                <NavLink to ={`/${state.content_type}/${item.id}`} className='nav-link'>
                  <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt=''/>
                  <h3>{item.original_name|| item.original_title}</h3>
                  <div className='rate'>
                      <span>{item.vote_average}</span>
                      <AiFillStar className='start'/>
                  </div>
                </NavLink>
              </div>
            )):''
          }
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={0}
            pageRangeDisplayed={ screen === 0 ? 6 : 3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />

        </div>
        
      </Content>
      {screen ===0 && <Sort>
        <div className='explore-sort'>
          <div className='sort-head'>
              <span>Sort</span>
              <button onClick={() => setOpen(!open)}>
                {!open?<BiChevronDown  className='sort-head-icon'/>:
                <BiChevronRight className='sort-head-icon'/>}
              </button>
          </div>
          {
            !open?
            <div className='sort-results' >
              <span>Sort results by</span>
              <select ref = {option} className='sort-select' onClick={ChangeOption}>
                  <option value={'popular'}>Popular</option>
                  <option value = {'top_rated'}>Top rated</option>
                  <option value = {state.content_type==='movie'?'upcoming' :'airing_today'}>On the air</option>
              </select>
          </div>:''
          }
            
        </div>
        
        <div className='explore-filter'>
            
        </div>
      </Sort>}
    </Container>
  )
}

const Container = styled.div`
    flex: 1;
    display: flex;
    justify-content:space-between;
`
const Content = styled.div`
  width: calc(100vh - 310px);
  width: ${({scr}) => scr === 2 ? '100%' : scr ===1 ? '100%': 'calc(100vh - 310px)'};;
  flex: 1;
  padding: 24px 32px 0 32px;
  overflow-x: hidden;

  .content-head{
    display: flex;
    justify-content:space-between;
    align-items: center;
    margin-bottom: 20px;

    span{
      font-size: ${({scr}) => scr === 2 ? '20px' : '30px'};
      color: #fff;
      font-weight: bold;
    }
  }

  .content-type{
      margin-bottom: 20px;
      button{
        background: transparent;
        font-size: ${({scr}) => scr === 2 ? '16px' : '18px'};
        color: rgba(255,255,255,0.7);
        margin-right: 20px;
        border: none;
        outline: none;
        position: relative;
        transition: all 0.5s  linear;
        cursor: pointer;

        &:hover{
          color: #fff;
        }
      }

      .active::before{
          content:'';
          position: absolute;
          bottom: -8px;
          left: 2px;
          width: 100%;
          height: 4px;
          background: rgb(0,0,255);
          transition: all 0.5s  linear;
      }
  }

  .content-body{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${({scr}) => scr === 0 ? ' 600px' : 'calc(100vh - 60px)'};
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 2s linear;
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

    .body-content-item{
      width:${({scr}) => scr === 2 ? '36%' : scr === 1 ? '27%': '20%'};
      margin: 16px;
      position: relative;
      text-align: center;
      background-color: rgba(255,255,255,0.1);
      border-radius:12px;
      transition: all 0.5s  ease-in;
      border: 1px solid rgba(255,255,255,0.1);

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

    .pagination{
      display: flex;
      list-style: none;
      padding: 0;
      font-size: ${({scr}) => scr === 2 ? '16px' : '18px'};
      font-weight: bold;
      color: rgba(255,255,255,0.7);

      .page-item{
        margin: ${({scr}) => scr === 2 ? '0 15px' : '0 20px'};
        height: ${({scr}) => scr === 2 ? '26px' : '40px'};
        width: ${({scr}) => scr === 2 ? '26px' : '40px'};
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover{
          cursor: pointer;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        
      }
      .active{
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          color: white;
      }

      .disabled{
        cursor: not-allowed!important;
      }
    }
  }
`
const Sort = styled.div`
    width: 270px;
    border-left: 2px solid rgba(255,255,255,0.2);
    padding: 32px 20px;
    font-size: 18px;

    @keyframes lin{
      from {
        opacity: 0.5
      }
      to {
        opacity: 1
      }
    }
    .explore-sort{
        padding: 20px 20px ;
        background: rgba(255,255,255,0.2);
        border-radius: 12px;
        transition: all 0.5s  linear;


        .sort-head{
            display: flex;
            align-items: center;
            justify-content:space-between;

            .sort-head-icon{
                font-size: 26px;
            }
            button{
              background: transparent;
              border: none;
              cursor: pointer;
              .hide{
                display: none;
                transition: all 0.5s  linear;
              }
            }
            
        }

        .sort-results{
            display: flex;
            flex-direction: column;
            padding-top: 8px;
            border-top: 2px solid black;
            margin-top:10px;
            animation-name: lin;
            animation-duration: 2s;
            animation-fill-mode: both;
            transition: all 0.5s  linear;

            span{
                padding-bottom: 10px;
            }

            .sort-select {
                background: rgba(255,255,255,0.2);
                border-radius:6px;
                font-size: 17px;
                padding: 8px 12px;
                border: none;
                outline: none;
                color: #fff;
                background-color: #49494b;
                /* needed */
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                /* SVG background image */
                background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");
                    background-size: .6em;
                    background-position: calc(100% - 1.3em) center;
                    background-repeat: no-repeat;
                
                &::-ms-expand {
                    display: none;
                }
            }
            
        }
    }
`

const Sortmini = styled.div`
        .sort-results{
            width: 200px;
            display: flex;
            flex-direction: column;
            padding-top: 8px;
            border-top: 2px solid black;
            margin-top:10px;
            animation-name: lin;
            animation-duration: 2s;
            animation-fill-mode: both;
            transition: all 0.5s  linear;

            span{
                padding-bottom: 10px;
            }

            .sort-select {
                background: rgba(255,255,255,0.2);
                border-radius:6px;
                font-size: 16px;
                padding: 8px 12px;
                border: none;
                outline: none;
                color: #fff;
                background-color: #49494b;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23000000%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");
                    background-size: .6em;
                    background-position: calc(100% - 1.3em) center;
                    background-repeat: no-repeat;
                
                &::-ms-expand {
                    display: none;
                }
            }
            
        }
`

export default ExploreContent
