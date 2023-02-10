import React, {useState, useEffect} from 'react'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import styled from 'styled-components'
import { useStore } from '../../hooks'
import axios from "axios"
import {IoSend} from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import {refreshToken, actions} from '../../store'

const CommentOption = ({comment, socket, type, setComment}) => {
    const data = useStore()
    const cmtLikers = comment.likers
    const [reply, setReply] = useState(false)
    const [cmt, setCmt] = useState('')
    const [isLike, setIsLike] = useState(Array.isArray(cmtLikers) && cmtLikers.includes(data[0].user._id))
    const [numLike, setNumLike] = useState(Array.isArray(cmtLikers) && cmtLikers.length > 0 ?  cmtLikers.length : '')
    // const likeComment =  async () => {
    //     if(isLike) {
    //         socket.current.emit("unlike-comment", {
    //             idUser: data[0].user._id,
    //             commentId: comment._id,
    //         })
    //     }
    //     else {
    //         socket.current.emit("like-comment", {
    //             idUser: data[0].user._id,
    //             commentId: comment._id,
    //         })
    //     }
        
    //     await axios.post(
    //         `${process.env.REACT_APP_BASE_URL}/comment/${isLike ? 'unlike-comments' : 'like-comments'}`,
    //         {
    //             commentId: comment._id,
    //             userId : data[0].user._id
    //         },
    //         {
    //             headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization' : data[0].token
    //             }
    //           },
    //         { withCredentials: true }
    //     )
    //     if(isLike) {
    //         setNumLike(numLike -1 > 0? numLike - 1 : '')
    //     }
    //     else {
    //         setNumLike(numLike + 1 > 0? numLike + 1 : '')
    //     }
    //     setIsLike(!isLike)
    // }

    // useEffect(() => {

    //     const getLikers = async (id) =>{
    //         const rs = await axios.get(
    //           `${process.env.REACT_APP_BASE_URL}/comment/comment`,
              
    //           {params: {
    //             id: id,
    //           }},
    //           {
    //             headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization' : data[0].token
    //             }
    //           },
    //           { withCredentials: true }
    //         )
    //         return rs.data.likers.length || ''
    //     }

    //     getLikers(comment._id)
    //     .then(data => {
    //         setNumLike(data)
    //     })
    // },[])

    // const createCommentReply =  async () => { 

    //     const res = await axios.post(
    //       `${process.env.REACT_APP_BASE_URL}/comment/comments`,
    //       {data: {
    //         idUser: data[0].user._id,
    //         idMovie: comment.idMovie,
    //         content: cmt,
    //         reply: comment._id
    //       }},
    //       {
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization' : data[0].token
    //         }
    //       },
    //       { withCredentials: true }
    //     )
    
    //     if (data[0].user._id)
    //       socket.current.emit("send-comment", res.data)
    
    //     setCmt('')
          
    //     setComment(comment => comment.map(item =>{
    //         if(item.cmt._id === res.data.reply){
    //             item.reply.unshift(res.data)
    //         }
    //         return item
    //         }))
    //   }
    let navigate = useNavigate()
    
    const likeComment =  async () => {
        if(isLike) {
            socket.current.emit("unlike-comment", {
                idUser: data[0].user._id,
                commentId: comment._id,
            })
        }
        else {
            socket.current.emit("like-comment", {
                idUser: data[0].user._id,
                commentId: comment._id,
            })
        }
        
        await axios.post(
            `${process.env.REACT_APP_BASE_URL}/comment/${isLike ? 'unlike-comments' : 'like-comments'}`,
            {
                commentId: comment._id,
                userId : data[0].user._id
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : data[0].token
                }
              },
            )

            if(isLike) {
                setNumLike(numLike -1 > 0? numLike - 1 : '')
            }
            else {
                setNumLike(numLike + 1 > 0? numLike + 1 : '')
            }
            setIsLike(!isLike)
        
    }

    useEffect(() => {

        const getLikers = async (id) =>{
            const rs = await axios.get(
              `${process.env.REACT_APP_BASE_URL}/comment/comment`,
              
              {params: {
                id: id,
              }},
              {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : data[0].token
                }
              },
            )
            
            return rs.data.likers.length || ''
        }

        getLikers(comment._id)
        .then(data => {
            setNumLike(data)
        })
    },[])

    const createCommentReply =  async () => { 

        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/comment/comments`,
          {data: {
            idUser: data[0].user._id,
            idMovie: comment.idMovie,
            content: cmt,
            reply: comment._id
          }},
          {
            withCredentials: true,
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : data[0].token
            }
          },
        )
        .then(res => {
            if (data[0].user._id)
            socket.current.emit("send-comment", res.data)
        
            setCmt('')
            
            setComment(comment => comment.map(item =>{
                if(item.cmt._id === res.data.reply){
                    item.reply.unshift(res.data)
                }
                return item
            }))
        })
        .catch( async err => {
            if(err.request.status === 403) {
              await refreshToken()
              .then(response => {
                data[1](actions.setToken(response.accessToken))
              })
              .catch( err => {
                data[1](actions.setUser(null)) 
                data[1](actions.setLogIn(false))
                data[1](actions.setToken(''))
                navigate('/login')
              })
            }
            
        })
        
      }

    useEffect(() => {
        if(data[0].user._id){
          socket.current.on("like-receive", (res) => {
            if(comment._id === res.commentId){
                if(!comment.likers.includes(res.idUser))
                    comment.likers.push(res.idUser)
                setNumLike(comment.likers.length > 0? comment.likers.length : '')
            }
          })

          socket.current.on("unlike-receive", (res) => {
            if(comment._id === res.commentId){
                if(comment.likers.includes(res.idUser))
                    comment.likers = comment.likers.filter(item => item !== res.idUser)
                setNumLike(comment.likers.length > 0? comment.likers.length : '')
            }
          })
        }
    }, [])

    return (
        <Container>
            <CmtOption>
                <button 
                onClick={async () => {
                    await likeComment()}
                }> 
                {numLike} { !isLike ? 
                    <AiOutlineHeart 
                        fontSize={16}
                        color = 'blue'
                    /> : 
                    <AiFillHeart 
                        fontSize={16}
                        color = 'red'
                    />}
                </button>
                {type !== 'reply' && <button onClick={() => {setReply(true)}}>Reply</button>}
                <span>{comment.updatedAt ? comment.updatedAt.slice(0, comment.updatedAt.indexOf('T')) : ''}</span>
            </CmtOption>
            {data[0].user && reply && 
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
                            await createCommentReply()
                            setReply(false)
                        }}
                    ><IoSend/></button>
                    </div>
                </CommentInput>
            }
        </Container>
    )
    
}

export default CommentOption


const CmtOption = styled.div`
    display: flex;
    margin: 6px 0 0 66px;
    
    button{
        margin-right: 20px;
        font-size: 12px;
        border: none;
        background: transparent;
        color: white;
        padding: 0;
        cursor: pointer;
        transition: all 0.5s linear;
        display: flex;
        align-items: center;

        &:hover {
            color: var(--primary-color);
        }
    }

    span{
        margin-right: 20px;
        font-size: 12px;
    }
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
`
const CommentInput = styled.div`
  display: flex;
  align-items: center;
  margin:  6px 0 20px 100px;
  position: relative;
  

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

