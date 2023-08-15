import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({Component}) => {
    const navigate = useNavigate();
    useEffect(() => {
	const user = localStorage.getItem("branchInternational");
    if(!user){
        navigate("/signin")
    }
    }, [])
    
  return (
    <div>
        <Component/>
    </div>
  )
}

export default ProtectedRoute