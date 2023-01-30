import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Movie from './Movie'
import TVShow from './TVShow'
import Comment from './Comments'
import {BiCommentDetail} from'react-icons/bi'
import {IoSend} from 'react-icons/io5'
import { useStore } from '../../hooks'
import axios from "axios"
import {ssEvents} from '../../shared/sse'

const FilmWatchMain = ({id, type,screen}) => {
  const [sortValues, setSortValues] = useState('Descending')
  const [comment, setComment] = useState([])
  const [cmt, setCmt] = useState('')
  const data = useStore()
  const userId = data[0].user._id

  const changeRating = (e) => {
    setSortValues(e.target.value)
  }

  //get comments
  useEffect(() => {
    const getComments =  async () => { 
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/comment/comments`,
          {params: {
            id: id,
          }},
          { withCredentials: true }
        )
        const rs = res.data.data
        const sameArray = rs.every((value, index) => JSON.stringify(value)=== JSON.stringify(comment[index]))
        
        if( !sameArray)
          setComment(res.data.data)
        return res.data
    }
    getComments()

    ssEvents.addEventListener("message", (e) => {})
    
    // listen to comment event
    ssEvents.addEventListener("comment", (e) => {
      const data = JSON.parse(e.data)
      setTimeout(() => {
          setComment([...comment, data])
      }, 500)
    })
    
    //listen to comment reaction events
    ssEvents.addEventListener("comment_reaction", (e) => {
      const { liker, post } = JSON.parse(e.data)
      const posts = comment.map((p) =>
        p._id === userId
          ? { ...p, likers: [...post.liker] }
          : p
      );
      return posts
    })

    // listen to open event
    ssEvents.onopen = (e) => {
      console.log(e)
    }
    // listen to error event
    ssEvents.onerror = (e) => {
      console.log(e)
    }

    return () => {
      ssEvents.close()
    }

  }, [id, userId, comment])

  const createComment =  async () => { 
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/comment/comments`,
      {data: {
        idUser: userId,
        idMovie: id,
        content: cmt,
      }},
      { withCredentials: true }
    )
    return res.data
}

  return (
    <Container scr = {screen}>
      {
          type==='tv'
        ?
          <TVShow 
              id={id}
              screen={screen}
          /> 
        : 
          <Movie 
              id={id}
              screen={screen}
          />
      }
      <Comments>
        <CommentsHead>
          <div className='comment-title'>
            <BiCommentDetail/>
            <h3>Comments</h3>
          </div>
          <div className='comment-sort'>
            <select 
              className='sort-select'
              value={sortValues}
              onChange = {(e) => changeRating(e)}
            >
                <option value={'Descending'}>Descending</option>
                <option value={'Ascending'}>Ascending</option>
            </select>
          </div>
        </CommentsHead>

        {data[0].user && <CommentInput>
            <img src={data[0].user.avatar} alt='' />
            <div>
              <input 
                type="text" 
                placeholder="Write a comment..." 
                value={cmt}
                onChange = {(e) => {setCmt(e.target.value)}}
              />
              <button 
                onClick={ async () => {
                  const rs = await createComment()
                  setCmt('')
                  setComment([...comment, rs.data[0]])
                }}
              ><IoSend/></button>
            </div>
        </CommentInput>}
        {Array.isArray(comment) && comment.length > 0? comment.map(item => 
            <Comment 
              key = {item._id}
              id={item._id}
              comment = {item}
            /> 
         ) : 'There are no comment yet'}
         
      </Comments>

    </Container>
  )
}

const Container = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
   
`

const Comments = styled.div`
  padding: 0 40px;
  margin: 20px 0;
`

const CommentsHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .comment-title{
    display: flex;
    align-items: center;
    margin-right: 200px;
    h3{
      margin: -2px 0 0 4px;
    }
  }

  .comment-sort{
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
`

const CommentInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  &:before {
    content:'';
    width: 74%;
    height: 2px;
    position: absolute;
    bottom: -12px;
    left: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
  }

  img{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
  }

  div{
    display: flex;

    align-items: center;
    width: 60%;
    background: rgba(255,255,255,0.2);
    padding: 8px 12px;
    border-radius: 20px;

    input{
      background: transparent;
      outline: none;
      border: none;
      flex: 1;
      color: white;

      &::placeholder {
        font-style: italic;
        font-size: 15px;
      }
    }

    button{
      background: transparent;
      outline: none;
      border: none;
      color: white;
      margin-top: 2px;
    }
  }
`

export default FilmWatchMain

