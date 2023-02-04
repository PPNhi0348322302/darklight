import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import Movie from './Movie'
import TVShow from './TVShow'
import Comment from './Comments'
import {BiCommentDetail} from'react-icons/bi'
import {IoSend} from 'react-icons/io5'
import { useStore } from '../../hooks'
import axios from "axios"
import socketIOClient from "socket.io-client"

const FilmWatchMain = ({id, type,screen}) => {
  const [sortValues, setSortValues] = useState('Descending')
  const [comment, setComment] = useState([])
  const [commentArrival, setCommentArrival] = useState(null)
  const [cmt, setCmt] = useState('')
  const data = useStore()
  const userId = data[0].user._id
  const socket = useRef()

  const changeRating = (e) => {
    setSortValues(e.target.value)
  }

  useEffect(() => {
    const getComments =  async () => { 
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/comment/comments`,
          {params: {
            id: id,
            type: sortValues
          }},
          { withCredentials: true }
        )
        return res.data
    }

    const getReply = async (id) =>{
      const rs = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/comment/reply`,
        {params: {
          id: id,
        }},
        { withCredentials: true }
      )
      if(rs.data.length > 0)
      {
        return (rs.data)
      }
      return []
    }

    getComments()
    .then(data => {
      let listCmt = data.map(  item => {
        return getReply(item._id)
                .then(data => {return {cmt: item, reply: data}})
      })
      return listCmt
    })
    .then((data) => {
      let items = Promise.all(data);
      return items;
    })
    .then((data) => {
        setComment(data)
    })

  }, [id, userId, sortValues])
  

  useEffect(() => {
    if (userId) {
      socket.current = socketIOClient.connect(process.env.REACT_APP_BASE_URL)
      socket.current.emit("add-user", userId)
    
      socket.current.on("comment-receive", (data) => {
        setCommentArrival(data)
      })
      return () => {socket.current.disconnect()}
    }
  }, [])

  useEffect(() => {
    if(commentArrival === null)
      return
    if(commentArrival.reply === ''){
      let listCmt = comment
      listCmt.unshift({cmt: commentArrival, reply: []})
      setComment(listCmt)
    }
    else {
      const listCmt = comment.map(item =>{
        if(item.cmt._id === commentArrival.reply){
          item.reply.unshift(commentArrival)
        }
        return item
      })
      setComment(listCmt)
    }
    setCommentArrival(null)      
  }, [commentArrival, comment])

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

    if (userId)
      socket.current.emit("send-comment", res.data)

    setCmt('')
    
    if(res.data.reply === ''){
      const Comments = [...comment]
      Comments.unshift({cmt: res.data, reply: []})
      setComment(Comments)
    }
    else {
      const listCmt = comment.map(item =>{
        if(item.cmt._id === res.data.reply){
          item.reply.unshift(res.data)
        }
        return item
      })
      console.log(listCmt);
      
      setComment(listCmt)
    }
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

        {userId && 
        <CommentInput>
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
                  await createComment()
                }}
              ><IoSend/></button>
            </div>
        </CommentInput>}

        {Array.isArray(comment) && comment.length > 0? comment.map((item, index) =>
        <div key = {index}>
            <Comment 
              id={item.cmt._id}
              comment = {item.cmt}
              socket = {socket}
              setComment = {setComment}
            /> 
            {item.reply.map((item, index) => {
                return <Comment 
                  type= 'reply'
                  key = {index}
                  id={item._id}
                  comment = {item}
                  socket = {socket}
                  setComment = {setComment}
                />
            })}
        </div> 
            
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

