// có nhiệm vụ export các file có trong store ra ngoài
import axios from "axios"

export {default as StoreProvider} from './Provider'
export {default as StoreContext} from './Context'

export const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user`,
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : ''
            }
          },
        { withCredentials: true }
      )
      return {accessToken: response.data.accessToken}
    } 
    catch(error) {
        return {accessToken: ''}
    }
}
export * as actions from './action'