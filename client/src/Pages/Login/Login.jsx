import React from 'react'
import './Login.css'
import Auth from '../../Components/Auth/Auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='log-form-cont'>
      <div className='log-text-content'>
        <p className='assign-text'>Assign</p>
        <p className='assign-desc-text'>All in one solution to manage tasks</p>
      </div>
      <div>
        <Auth />
      </div>
    </div>
  )
}

export default Login