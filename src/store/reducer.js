//file chứa state
import { 
    SET_THEME, 
    SET_LOGIN , 
    SET_CONTENT_TYPE,
    SET_SEARCH,
    SET_OPTION, 
    SET_SCREEN,
    SET_USER,
    SET_TOKEN
} 
from "./constants"

const iniState = {
    theme:'Dark',
    content_type:'tv',
    login: false,
    search: '',
    option: {},
    screen:0,
    user: {},
    token: ''
}

function reducer(state, action){
    switch(action.type){
        case SET_THEME:
            return {
                ...state,
                theme: action.payload
            }
        case SET_LOGIN:
            return {
                ...state,
                login: action.payload
            }
        case SET_CONTENT_TYPE:
            return {
                ...state,
                content_type: action.payload
            }
        case SET_SEARCH:
            return {
                ...state,
                search: action.payload
            }
        case SET_OPTION:
            return { 
                ...state,
                option: action.payload
            }
        case SET_SCREEN:
            return {
                ...state,
                screen: action.payload
            }
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case SET_TOKEN: 
            return {
                ...state,
                token: action.payload
            }
        default:
            return state
    }
}

export {iniState}
export default reducer