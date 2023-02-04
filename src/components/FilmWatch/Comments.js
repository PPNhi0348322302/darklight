import React, {useState, useEffect} from 'react'
import axios from "axios"
import styled from 'styled-components'
import CommentOption from './CommentOption'
const Comments = ({type, id, comment, socket, setComment}) => {
    const [userComment, setUserComment] = useState({})
    useEffect(() => {
        const getUserComments = async (id) => {
            if(!id) return 'err'
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
    }, [id, comment])
    
  return (
    <ContainerCmt scr = {type}>
      <Content>
        <img src= {userComment.avatar} alt='' />
        <ContentComment>
            <h3>{userComment.name}</h3>
            <span>{comment.content}</span>
        </ContentComment>
      </Content>
      <CommentOption
        key={comment._id} 
        comment={comment} 
        socket = {socket}
        type = {type}
        setComment = {setComment}
      />
      <ReplyContainer>

      </ReplyContainer>
    </ContainerCmt>
  )
}

const ContainerCmt = styled.div`
    display: flex;
    flex-direction: column;
    margin: 4px 0 10px;
    margin-left: ${({scr}) => scr === 'reply' ? '40px' : '0px'};
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

const ReplyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin:10px 0 0 40px;
`


export default Comments
