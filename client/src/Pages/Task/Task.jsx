import React from 'react'
import './Task.css'
import TaskForm from '../../Components/TaskForm/TaskForm'

const Task = () => {
  return (
    <div className='ass-form-cont'>
      <div className='ass-text-content'>
        <p className='assign-text-task'>Assign</p>
        <p className='assign-desc-text-task'>All in one solution to manage tasks</p>
      </div>
      <div style={{ width: "95%" }}>
        <TaskForm />
      </div>
    </div>
  )
}

export default Task