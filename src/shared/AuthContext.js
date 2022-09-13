import React, { createContext, useContext, useEffect, useState } from 'react'
import {useStore} from '../hooks'
import {actions} from '../store'
import {auth, db} from './firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updatePassword,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
} 
from 'firebase/auth'

import {
    collection,
    doc,
    addDoc,
    deleteDoc,
  } from 'firebase/firestore'

const AuthContext = createContext({
    currentUser: null,
    register: () => Promise,
    login : () => Promise,
    logout : () => Promise,
    forgotPassword : () => Promise,
    updateUserPassword : () => Promise,
    googleSignIn : () => Promise,
    FacebookSignIn : () => Promise,
    createData : () => Promise,
    deleteData : () => Promise
})

export const useAuth = () => useContext(AuthContext)

export default function AuthContextProvider ({children})  {
    const data = useStore()
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const currUser = auth.onAuthStateChanged((authUser) => {
            setCurrentUser(authUser)
        })
        return currUser
    }, [])

    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        data[1](actions.setLogIn(false))
        return signOut(auth)
    }

    function forgotPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function updateUserPassword(user, password){
        return updatePassword(user, password)
    }

    function googleSignIn () {
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }

    function FacebookSignIn () {
        const provider = new FacebookAuthProvider()
        return signInWithPopup(auth, provider)
    }

    //firestore: 
    const createData = async (nameDB, iditem, typeitem, path, head) => {
        if (currentUser === null)
            return
        await addDoc(collection(db, nameDB), {
            type: typeitem,
            idMovie: iditem,
            img_path: path,
            header : head,
            userID: currentUser.uid,
        })
    }

    const deleteData = async (nameDB,id) => {
        await deleteDoc(doc(db, nameDB, id))
    }
    

    //end of firestore
    const value = {
        currentUser,
        register,
        login,
        logout,
        forgotPassword,
        updateUserPassword,
        googleSignIn,
        FacebookSignIn,
        createData,
        deleteData
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

