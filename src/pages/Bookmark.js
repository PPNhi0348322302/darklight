import React, {useState,useEffect} from 'react'
import styled from 'styled-components'
import { TabTitle } from '../store/Genera'
import SideBar from '../components/Comon/SideBar'
import Sidebarmini from '../components/Comon/Sidebarmini'
import {useAuth} from '../shared/AuthContext'
import { NavLink } from 'react-router-dom'
import {db} from '../shared/firebase'
import {
  query,
  collection,
  onSnapshot,
  where
} from 'firebase/firestore'

const Bookmark = () => {
  const [Bookmark, setBookmark] = useState([])
  const {currentUser} = useAuth()
  TabTitle('Bookmark | DarkLight')
  useEffect(() =>{
      if (currentUser !== null){
        const books = collection(db, 'bookmarks')
        const q = query(books, where('userID', '==', currentUser.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let BookmarkList = []
          querySnapshot.forEach((doc) => {
            BookmarkList.push({...doc.data(), id: doc.id})
          })
          setBookmark(BookmarkList)
        })
        return () => unsubscribe()
      }
      else setBookmark([])
  }, [currentUser])  

  //screen
  const [type, setType] = useState(window.innerWidth <=480 ? 2 : window.innerWidth <=900 ? 1 :0)

  useEffect(() => {
    const handleResize = () => {
      
      if(window.innerWidth <= 480)
        setType(2)
      else if(window.innerWidth <= 900)
        setType(1)
      else setType(0)
    }

    window.addEventListener("resize", handleResize)

    return () => window.addEventListener("resize", handleResize)
  },[])

  return (
    <Container scr = {type}>
      {type ===1 ? <Sidebarmini /> : <SideBar screen = {type}/>}
      <BookmarkContent>
        <Headerside>
            <button className = 'active'>
              <span>Bookmark</span>
            </button>
            
        </Headerside>

        <HisBody>
            {
              Array.isArray(Bookmark) && Bookmark.length === 0? <span>Not found</span>:
              Bookmark.map(item => (
                <div  className='body-content-item'  key={item.id}>
                  <NavLink to ={`/${item.type}/${item.idMovie}`} className='nav-link'>
                    <img src={`https://image.tmdb.org/t/p/w342${item.img_path}`} alt=''/>
                    <h3>{item.header}</h3>
                  </NavLink>
                </div>
              ))
            }
        </HisBody>

      </BookmarkContent>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: ${({scr}) => scr === 2 ? 'column' : 'row'};
  height: calc(100vh - 60px);
  color: #fff;
`

const BookmarkContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 32px 0 0 32px;
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
`
const Headerside = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 42px;
  margin-bottom: 40px;
  
  button{
    font-size: 20px;
    margin: 0 20px;
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;

    span{
      padding:0 10px;
    }
  }

  .active{
    color: blue;
    position: relative;

    &:before{
      content: '';
      height:3px;
      width: 100%;
      background: blue;
      position: absolute;
      bottom: -4px;
      left: 0;
    }
  }
  
`

const HisBody = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: ${({scr}) => scr === 2 ? 'center' : 'flex-start'};
    
    .body-content-item{
      margin: 8px 16px;
      width:200px;
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

      }

      &:hover {
        cursor: pointer;
        transform:  scale(1.07);
        overflow: auto;
        z-index:9;
      }
      

      
    }
`
export default Bookmark
