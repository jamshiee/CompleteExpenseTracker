import React from 'react'
import useStore from '../store/index'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {


    const {user} = useStore((state)=>state);

  return user ? children : (
    <Navigate to={"/sign-in"}  replace={true}/>
  )
}

export default ProtectedRoute