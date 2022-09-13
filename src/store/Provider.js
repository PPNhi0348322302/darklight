import React, {useReducer} from 'react'
import Context from './Context'
import reducer, {iniState} from './reducer'

function Provider({children}) {
    const [state, dispatch] = useReducer(reducer,iniState)
  return (
    <Context.Provider value={[state, dispatch]}>
        {children}
    </Context.Provider>
  )
}

export default Provider