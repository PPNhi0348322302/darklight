import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {BiSearch} from 'react-icons/bi'
import {useAxios} from '../../hooks'
import {instance} from '../../shared/instance'
import {useStore} from '../../hooks'
import {actions} from '../../store'
import ReactPaginate from "react-paginate";
import {NavLink} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BiChevronDown, BiChevronRight} from 'react-icons/bi'
import Empty from '../Comon/Empty'
const SearchDT = ({screen}) => {
  const [state, dispatch]  = useStore()
  const [searchvalue, setSearchValue] = useState('')
  const [List_search, setListSearch] = useState([])
  const [open, setOpen] = useState(false)
  const [sorttype, setSortType] = useState('multi')
  const [Datas, setDatas] = useState([])
  const [pageCount, setpageCount] = useState(0)
  const [pageValue, setPageValue] = useState(0)
  const [op, setOp] = useState(false)
  const option = useRef('') 

  const [SearchData] = useAxios({
    axiosInstance: instance,
    method: 'GET',
    url: `/search/keyword?api_key=${process.env.REACT_APP_API_KEY}&query=${state.search !==''?state.search :'/'}`,
  })
  
  useEffect(() => {
    let list_search = Array.isArray(SearchData.results) && SearchData.results.length > 0 
                      ? SearchData.results.length > 0 ? SearchData.results.slice(0, 5) :SearchData.results :[]
    Array.isArray(list_search) && list_search.length>0 ? setListSearch(list_search) : setListSearch([])
  }, [SearchData])
    
  const handleChange = (e) => {
    if(e.target.value ==='')
    {
      setListSearch([])
      setPageValue(0)
    }
      dispatch(actions.setSearch(e.target.value))
      setOp(false)
  }
  const handleClick = (value) => {
      setSearchValue(value)
      dispatch(actions.setSearch(value))
      setListSearch([])
      setOp(true)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      setSearchValue(e.target.value)
      setListSearch([])
      setOp(true)
    }
  }

  const ChangeOption = () => {
    setSortType(option.current.value)
    setpageCount(0)
  }

//pagination
  let limit = 10
  useEffect(() => {
    const getComments = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/${sorttype}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${searchvalue===''?'/':searchvalue}`
      )
      const data = await res.json()
      const rs = data.total_results
      setPageValue(rs === undefined ? 0 : rs)
      setpageCount(Math.ceil(rs / limit))
      const Data = Array.isArray(data.results) ? data.results.filter(item => item.media_type !== 'person') : data.results
      setDatas(Data === undefined ? [] : Data)
    }
    getComments()
  }, [searchvalue, limit, sorttype])

  const fetchListSearch = async (currentPage) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${sorttype}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${state.search !==''?state.search :'/'}&page=${currentPage}`
    )
    const data = await res.json()
    return data
  }

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1

    const commentsFormServer = await fetchListSearch(currentPage)

    setDatas(commentsFormServer.results === undefined ? [] : commentsFormServer.results)
  }

  
  
  return (
    <Container scr = {screen}>
      <div className='search-content'>
        <div className='search'>
            <div className='search-boxs'>
              <BiSearch className='search-icon' />
              <input
                  className='search-box'
                  placeholder='Search...'
                  value = {state.search}
                  onChange = {e => handleChange(e)}
                  onKeyPress={event => handleKey(event)}
              />
            </div>
            {
              List_search.length > 0 && state.search !==''?
              <div className='search-re'>
                  {
                    Array.isArray(List_search) && List_search.length >0?
                    List_search.map(item => (
                      <div 
                        className='search-item' 
                        key={item.id}
                        onClick= {() => handleClick(item.name)}
                      >
                          <span>{item.name}</span>
                      </div>
                    ))
                    :''
                  }
              </div>
              :''
            }
        </div>
        {state.search === '' ? <Empty screen = {screen}/> : ''}
        {
          Array.isArray(Datas)  && state.search !=='' && op?
          <div className='search-results'>
            <span className='search-key'>
            {`Search results for "${searchvalue}" ( ${pageValue} results found )`}
            </span>
            {screen !== 0 && 
            <SortMini>
                {
                  !open?
                  <div className='sort-results' >
                    <span>Search results by</span>
                    <select ref = {option} className='sort-select' onClick={ChangeOption}>
                        <option value={'multi'}>All</option>
                        <option value = {'movie'}>Movie</option>
                        <option value = {'tv'}>TV show</option>
                        <option value = {'people'}>People</option>
                    </select>
                </div>:''
                }
            </SortMini>}

            {
              Array.isArray(Datas) && Datas.length >0 ?
              <div className ='content-body'>
                <div className='content-items'>
                {
                  Array.isArray(Datas)?Datas.map(item => (
                    <div  className='body-content-item'  key={item.id}>
                      <NavLink to ={`/${sorttype==='multi' && sorttype !=='people'? item.media_type : sorttype}/${item.id}`} className='nav-link'>
                        <img 
                          src={item.poster_path !==null ?`https://image.tmdb.org/t/p/w342${item.poster_path}` :'/images/film.jpg'}
                          alt=''
                        />
                        <h3>{item.original_name|| item.original_title || item.name}</h3>
                        <div className='rate'>
                            <span>{item.vote_average}</span>
                            <AiFillStar className='start'/>
                        </div>
                      </NavLink>
                    </div>
                  )):''
                }
                </div>
                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={screen === 0 ? 6 : screen ===1 ? 3 : 2}
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
              : <span className = 'no-results'>No results found</span>
            }
          </div> 
          :''
        }
        

      </div>
      {screen === 0 && <div className='search-type'>
        <Sort>
          <div className='explore-sort'>
            <div className='sort-head'>
                <span>Search:</span>
                <button onClick={() => setOpen(!open)}>
                  {!open?<BiChevronDown  className='sort-head-icon'/>:
                  <BiChevronRight className='sort-head-icon'/>}
                </button>
            </div>
            {
              !open?
              <div className='sort-results' >
                <span>Search results by</span>
                <select ref = {option} className='sort-select' onClick={ChangeOption}>
                    <option value={'multi'}>All</option>
                    <option value = {'movie'}>Movie</option>
                    <option value = {'tv'}>TV show</option>
                    <option value = {'people'}>People</option>
                </select>
            </div>:''
            }
              
          </div>
          
          <div className='explore-filter'>
              
          </div>
        </Sort>
      </div>}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  color: #fff;
  flex: 1;
  .search-content{
    flex: 1;
    padding: 30px 30px 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    .search{
        margin-left: ${({scr}) => scr !== 0 ? '20px' : '60px'};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius:20px;
        max-width: 720px;
        width: ${({scr}) => scr !== 0 ? '60%' : '100%'};
        height: auto;
        background: rgb(28,28,30);
        padding: 0px 20px ;
        position: relative;
        z-index:99;

        .search-boxs{
          margin: 10px 30px;
          display: flex;
          max-width: 720px;
          width: 100%;
          height:32px;
          .search-icon{
            margin-right: 10px;
            font-size: 28px;
            color: rgba(255,255,255,0.6);
          }

          .search-box{
            border: none;
            background: transparent;
            font-size: 20px;
            width: 100%;
            outline: none;
            color: rgba(255,255,255,0.8);

            &::placeholder{
              font-size: 20px;
              color: rgba(255,255,255,0.4);
            
            }
          }
        }
        .search-re{
          display: flex;
          flex-direction: column;
          width: 100%;
          border-top: 2px solid rgba(255,255,255,0.1);
          z-index:100;
          .search-item{
            margin: 8px 0;
            color: white;
            height: 30px;
            display: flex;
            align-items: center;
            padding: 8px 20px;
            font-size: 17px;
            color: rgba(255,255,255,0.7);
            border-radius:12px;

            &:hover{
              cursor: pointer;
              background: rgba(255,255,255,0.2);
            }
          }
        }
    }
    .search-results{
        display: flex;
        flex-direction: column;
        margin-top:50px;
        .search-key{
          font-size: 18px;
          padding-top:20px;
          font-style: italic;
          color: rgba(255,255,255,0.7);
        }

        .content-body{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          width: 100%;
          overflow-y: auto;
          margin-top:20px;
          transition: all 2s linear;
          height: ${({scr}) => scr === 0 ? '600px' : '100%'};
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

            .content-items{
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: flex-start;
              width: 100%;

              .body-content-item{
                  width: ${({scr}) => scr === 1 ? '26%' : scr === 2 ? '36%' : '20%'};
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
                    height: 100%;
                    object-fit: cover;
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
    }

    .no-results{
      margin-top:80px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-style: italic;
    }
  }

  .search-type{
    width: 310px;
    border: 2px solid rgba(255,255,255,0.4);
    display: flex;
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

const SortMini = styled.div`
    .sort-results{
        display: flex;
        align-items: center;
        padding-top: 8px;
        border-top: 2px solid black;
        margin-top:10px;
        animation-name: lin;
        animation-duration: 2s;
        animation-fill-mode: both;
        transition: all 0.5s  linear;

        span{
            padding-bottom: 10px;
            margin-right: 10px;
        }

        .sort-select {
            background: rgba(255,255,255,0.2);
            border-radius:6px;
            font-size: 17px;
            width:160px;
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
`
export default SearchDT
