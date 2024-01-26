import React from 'react'
import Back from '../../assets/back.png'
import './DescHeader.css'
import { useNavigate } from 'react-router-dom'

const DescHeader = () => {

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  }

  return (
    <div className='desc-header-div'>
      <nav className='desc-header'>
        <img src={Back} alt='back-icon' className='back-logo' onClick={handleBack} />
      </nav>
    </div >
  )
}

export default DescHeader