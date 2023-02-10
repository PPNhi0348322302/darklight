import React, {useEffect, useCallback} from 'react'
import styled from 'styled-components'

const Toast = ({ toastList, position, setList }) => {
    const deleteToast = useCallback(id => {
        const toastListItem = toastList.filter(e => e.id !== id)
        setList(toastListItem)
      }, [toastList, setList])
    
      useEffect(() => {
        const interval = setInterval(() => {
          if(toastList.length) {
            deleteToast(toastList[0].id)
          }
        }, 3000)
    
        return () => {
          clearInterval(interval)
        }
      }, [toastList, deleteToast])

  return (
    <Container position={position}>
        {
            toastList.map((toast, index) =>(
                <div
                    key={index}
                    className='notification toast'
                    style={{ backgroundColor: 'rgb(169,171,174)' }}
                >
                    {toast.icon}
                    <div className='info'>
                        <p className='title'>{toast.title}</p>
                        <p className='description'>{toast.description}</p>
                    </div>
                    <button onClick={() =>deleteToast(toast.id)}>X</button>
                    <div 
                        className='wh'
                        style={{ backgroundColor: toast.backgroundColor }}
                    ></div>
                </div>
            ))
        }
    </Container>
  )
}

const Container = styled.div`
    font-size: 14px;
    position: fixed;
    z-index: 10;
    bottom: 1rem;
    right:  ${({position}) => position==='1' ? '-8rem' : '1rem'};
    animation: toast-in-right .7s;
    z-index:100;

    @keyframes toast-in-right {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

    .notification {
        margin-bottom: 1rem;
        border-radius: 4px;
        box-shadow: 0 0 10px #999;
        color: black;
        opacity: 0.9;
        transition: .3s ease;
        display: flex;
        align-items: center;
        position: relative;

        button{
            background: transparent;
            border: none;
            outline: none;
            color: #fff;
            font-size: 18px;
        }

        .icon{
            width:30px;
            height:30px;
            border-radius: 50%;
        }

        .wh{
            width: 100%;
            height:4px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .info{
            margin-left:10px;
            .title {
                font-weight: 700;
                font-size: 16px;
                text-align: left;
                margin-top: 0;
                margin-bottom: 6px;
                width: 300px;
                height: 18px;
                color: black;
            }

            .description {
                margin: 0;
                text-align: left;
                color: black;
            }
        }
        
    }

    .notification:hover {
        box-shadow: 0 0 12px #fff;
        opacity: 1;
    }

    .toast {
        height: 50px;
        width: 320px;
        color: #fff;
        padding: 20px 15px 10px 10px;
    }

`

export default Toast
