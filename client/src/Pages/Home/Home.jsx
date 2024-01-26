import React from 'react'
import Header from '../../Components/Header/Header'
import TaskHolder from '../../Components/TaskHolder/TaskHolder'
import PostTask from '../../Components/PostTask/PostTask'

const Home = () => {
  return (
    <>
      <Header />
      {localStorage.getItem('Profile') !== null && (JSON.parse(localStorage.getItem('Profile')).profile.role == 'teacher' && <PostTask />)}
      <TaskHolder />
    </>
  )
}

export default Home