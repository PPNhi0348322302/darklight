import React, {useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../shared/AuthContext'
import Home from '../../pages/Home'
import Explore from '../../pages/Explore'
import History from '../../pages/History'
import Profile from '../../pages/Profile'
import Bookmark from '../../pages/Bookmark'
import Search from '../../pages/Search'
import Login from '../../pages/Login'
import Register from '../../pages/Register'
import Detail from '../FilmDetail/Detail' 
import FilmWatch from '../FilmWatch/FilmWatch'

const AppRouter = () => {
  const {logout} = useAuth()
  
  useEffect(() => {
    const handleTabClosing = () => {
      logout()
    }

    window.addEventListener("beforeunload", handleTabClosing)

    return window.removeEventListener('beforeunload', handleTabClosing)
  })
  
  
  

  return (
    <Router>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path ='/explore' element={<Explore />}/>
            <Route path ='/search' element={<Search />}/>
            <Route path ='/history' element={<History />}/>
            <Route path ='/profile' element={<Profile />}/>
            <Route path ='/bookmark' element={<Bookmark />}/>
            <Route path ='/login' element={<Login />} />
            <Route path ='/register' element={<Register />} />
            <Route path ={`/:type/:id`} element={<Detail />} />
            <Route path ={`/:type/watch/:id`}  element={<FilmWatch />} />
        </Routes>
    </Router>
  )
}

export default AppRouter

