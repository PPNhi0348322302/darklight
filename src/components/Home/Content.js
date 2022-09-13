import React from 'react'
import styled from 'styled-components'
import {useStore} from '../../hooks'
import BodyContent from './BodyContent'
import ContentHeader from './ContentHeader'
import SliderContent from './SliderContent'
import {useAxios} from '../../hooks'
import {instance} from '../../shared/instance'

const Content = (props) => {
    const [state, dispatch]  = useStore()
    const [Popular] = useAxios({
        axiosInstance: instance,
        method: 'GET',
        url: `/${state.content_type}/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
    })

    const [Toprate] = useAxios({
        axiosInstance: instance,
        method: 'GET',
        url: `/${state.content_type}/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
    })

    const [Now] = useAxios({
        axiosInstance: instance,
        method: 'GET',
        url: `/${state.content_type}/${state.content_type==='movie'?'now_playing' :'on_the_air'}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
    })

    const [Hot] = useAxios({
        axiosInstance: instance,
        method: 'GET',
        url: `/${state.content_type}/${state.content_type==='movie'?'upcoming' :'airing_today'}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`,
    })
    
    
  return (
    <Container scr = {props.screen}>
        <ContentHeader
            dispatch = {dispatch}
        />
        <SliderContent
            state = {state}
            screen = {props.screen}
        />
        <ul className='body'>
            <li>
                <BodyContent
                    state = {state}
                    head='Popular'
                    data = {Popular.results}
                    screen = {props.screen}
                />
            </li>

            <li>
                <BodyContent
                    state = {state}
                    head = 'Top rated'
                    data = {Toprate.results}
                    screen = {props.screen}
                />
            </li>

            <li>
                <BodyContent
                    state = {state}
                    head = 'Hot'
                    data = {Hot.results}
                    screen = {props.screen}
                />
            </li>

            <li>
                <BodyContent
                    state = {state}
                    head = 'On the air'
                    data = {Now.results}
                    screen = {props.screen}
                />
            </li>
        </ul>
        
    </Container>
  )
}

const Container = styled.div`
    flex: 1;
    height: 100vh;
    width: 100%;
    max-width: 963px;
    /* margin-top: ${({scr}) => scr === 2 ? '60px' : '0'}; */
    display: flex;
    flex-direction: column;
    color: white;
    overflow-y: auto;
    overflow-x: hidden;
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
    
    
    .body{
        padding: 0 32px;
        list-style: none;
        //margin:20px 0 0;
        display: flex;
        flex-direction: column;

        li{
            width: 100%;
        }
    }
    
    `




export default Content
