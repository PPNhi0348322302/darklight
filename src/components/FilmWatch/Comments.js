import React, {useState, useEffect} from 'react'
import axios from "axios"
import styled from 'styled-components'
import {AiOutlineHeart, AiFillHeart} from 'react-icons/ai'

const commentOption = (comment) => {
    const isLike = comment.likers.length === 0 ? false : true
    const numLike = comment.likers.length === 0 ? '' : comment.likers.length
    return (
        <CommentOption>
            <button> {numLike} { !isLike ? 
                <AiOutlineHeart 
                    fontSize={16}
                    color = 'blue'
                /> : 
                <AiFillHeart 
                    fontSize={16}
                    color = 'red'
                />}
            </button>
            <button>Reply</button>
            <span>{comment.updatedAt ? comment.updatedAt.slice(0, comment.updatedAt.indexOf('T')) : ''}</span>
        </CommentOption>
    )
    
}

const Comments = ({id, comment}) => {
    const [userComment, setUserComment] = useState({})
    
    useEffect(() => {
        const getUserComments = async (id) => {
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/user/user`,
                {params: {
                  id: id,
                }},
                { withCredentials: true }
              )
            setUserComment(res.data)
            return res.data
        }
        getUserComments(comment.idUser) 
    }, [id, comment.idUser])
    
  return (
    <Container>
      <Content>
        <img src= {userComment.avatar} alt='' />
        <ContentComment>
            <h3>{userComment.name}</h3>
            <span>{comment.content}</span>
        </ContentComment>
      </Content>
        {commentOption(comment)}
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 4px 0 10px;
`

const Content = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10px;

    img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }
`

const ContentComment = styled.div`
    display: flex;
    flex-direction: column;
    padding: 4px 16px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    box-shadow: 2px 2px 2px rgba(255, 255, 255, 0.8);
    h3{
        margin: 0;
        font-size: 15px;
    }

    span{
        font-size: 14px;
        margin-top: 4px;
    }
`

const CommentOption = styled.div`
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

export default Comments
