import React from 'react'
import './Header.css'
import Avatar from '../Avatar/Avatar'

const Header = () => {
  return (
    <div className='header-div'>
      <nav className='header'>
        <p className='app-name'>Assign</p>
        <Avatar backgroundColor='#0288d1' px='12px' py='16px' color='#ffffff' fontSize='15px' borderRadius='50%'>{localStorage.getItem('Profile') !== null ? JSON.parse(localStorage.getItem('Profile')).profile.username.charAt(0).toUpperCase() : "S"}</Avatar>
      </nav>
    </div >
  )
}

export default Header