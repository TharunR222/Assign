import React from 'react'
import './PostTask.css'
import { useNavigate } from 'react-router-dom'



const PostTask = () => {
  const navigate = useNavigate();

  const postPage = (e) => {
    navigate("/task");
  }

  const viewStatus = (e) => {
    navigate("/status");
  }

  return (
    <div className='btn-hold'>
      <button className='btn' onClick={viewStatus}>View Status</button>
      <button className='btn' onClick={postPage}>Post a Task</button>
    </div>
  )
}

export default PostTask