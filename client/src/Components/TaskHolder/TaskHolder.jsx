import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar/Avatar'
import Assignment from '../../assets/assignment.png'
import './TaskHolder.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

const TaskHolder = () => {
  const [isData, setIsData] = useState([])
  useEffect(() => {
    hdata();
  }, []);

  const hdata = async () => {
    let Id = null;
    let role = JSON.parse(localStorage.getItem('Profile')).profile.role;
    if (role === 'teacher') {
      Id = JSON.parse(localStorage.getItem('Profile')).profile.t_id;
    } else {
      Id = JSON.parse(localStorage.getItem('Profile')).profile.rollno;
    }
    let response = await API.get(`/tasks/${role}/${Id}`);
    let jsonData = response.data.task;
    setIsData(jsonData);
  }

  return (
    <>
      {
        isData.length == 0 ? <>Loading...</> :
          isData.map((e) => {
            return (
              <>
                <Link to="/desc">
                  <div className='task-hold-main' key={e.title} onClick={() => { localStorage.setItem('currIndex', JSON.stringify(e.id)) }}>
                    <div className='task-hold'>
                      <Avatar backgroundColor='white' px='10px' py='10px' borderRadius='50%'><img src={Assignment} alt='assign' className='assign-logo' /></Avatar>
                      <p className='assign-title-hold'>{e.title}</p>
                    </div>
                    <div className="assign-det">
                      <p className='assign-date'>Assigned on {e.dueDate}</p>
                      <p className='assign-staff'>Assigned by Staff Name</p>
                    </div>
                  </div>
                </Link>
              </>
            );
          })
      }
    </>
  )
}

export default TaskHolder