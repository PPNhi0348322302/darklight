import { SET_THEME, SET_LOGIN, SET_CONTENT_TYPE, SET_SEARCH, SET_OPTION, SET_SCREEN} from "./constants"

export const setTheme = payload => ({
    type: SET_THEME,
    payload
})

export const setLogIn = payload => ({
    type: SET_LOGIN,
    payload
})

export const setContentType = payload => ({
    type: SET_CONTENT_TYPE,
    payload
})

export const setSearch = payload => ({
    type: SET_SEARCH,
    payload
})

export const setOption = payload => ({
    type: SET_OPTION,
    payload
})

export const setScreen = payload => ({
    type: SET_SCREEN,
    payload
})