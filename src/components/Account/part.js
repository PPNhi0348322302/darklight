import styled from "styled-components";
function Input({ type, placeholder, value, handleChage }) {
  return <StyledInput 
            type={type} 
            placeholder={placeholder} 
            value={value}
        />;
}

function Button({ content }) {
    return <StyledButton>{content}</StyledButton>;
  }

function Icon({ color, children }) {
    return <StyledIcon background={color}>{children}</StyledIcon>;
  }
  
  const StyledIcon = styled.div`
    height: 3.5rem;
    width: 3.5rem;
    background: ${(props) => props.background};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4rem;
    color: white;
    cursor: pointer;
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  `;
  
  const StyledButton = styled.button`
    background: linear-gradient(to right, #14163c 0%, #03217b 79%);
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    width: 65%;
    height: 3rem;
    border: none;
    color: white;
    border-radius: 2rem;
    cursor: pointer;

    &:hover{
        background: linear-gradient(to right, #03217b 0%, #14163c 79%);
        transition: all 2s  linear;
    }
  `;

const StyledInput = styled.input`
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border-radius: 2rem;
  width: 80%;
  height: 3rem;
  padding: 1rem;
  border: none;
  outline: none;
  color: #3c354e;
  font-size: 1rem;
  font-weight: bold;
  &:focus {
    display: inline-block;
    backdrop-filter: blur(12rem);
    border-radius: 2rem;
    color: white;
    font-weight: normal;
  }
  &::placeholder {
    color: #b9abe099;
    font-weight: 100;
    font-size: 1rem;
  }
`

export {Input, Button, Icon}