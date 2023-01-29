import React, {useState} from 'react'
import styled from 'styled-components'
// import { useStore } from '../../hooks'
import Movie from './Movie'
import TVShow from './TVShow'
import Comment from './Comments'
import {BiCommentDetail} from'react-icons/bi'
import {IoSend} from 'react-icons/io5'
import { useStore } from '../../hooks'

const FilmWatchMain = ({id, type,screen}) => {
  const [sortValues, setSortValues] = useState('Descending')
  const changeRating = (e) => {
    setSortValues(e.target.value)
  }

  const data = useStore()

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
            <form>
              <input type="text" placeholder="Write a comment..." />
              <button type='submit'><IoSend/></button>
            </form>
        </CommentInput>}

         <Comment 
            id={1}
         />
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

  form{
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

