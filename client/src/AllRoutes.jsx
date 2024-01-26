import React from 'react'
import Home from './Pages/Home/Home'
import Description from './Pages/Description/Description'
import Login from './Pages/Login/Login'
import { Routes, Route } from 'react-router-dom'
import Task from './Pages/Task/Task'
import StatusPage from './Pages/StatusPage/StatusPage'

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/home' element={<Home />} />
      <Route path='/desc' element={<Description />} />
      <Route path='/' element={<Login />} />
      <Route path='/task' element={<Task />} />
      <Route path='/status' element={<StatusPage />} />
    </Routes>
  )
}

export default AllRoutes