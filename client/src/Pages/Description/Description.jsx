import React from 'react'
import './Description.css'
import DescHeader from '../../Components/DescHeader/DescHeader'
import axios from 'axios';
import { useState, useEffect } from 'react';

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

const Description = () => {

  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isData, setIsData] = useState([])
  useEffect(() => {
    hdata()
  }, []);

  const hdata = async () => {
    let role = null;
    let Id = null;
    if (JSON.parse(localStorage.getItem('Profile')).profile.role === 'teacher') {
      role = JSON.parse(localStorage.getItem('Profile')).profile.role;
      Id = JSON.parse(localStorage.getItem('Profile')).profile.t_id;
    } else {
      role = JSON.parse(localStorage.getItem('Profile')).profile.role;
      Id = JSON.parse(localStorage.getItem('Profile')).profile.rollno;
    }
    let response = await API.get(`/tasks/${role}/${Id}`);
    let jsonData = response.data.task;
    console.log(jsonData)
    setIsData(jsonData);
  }


  const handleRegister = async () => {
    const currIndex = localStorage.getItem('currIndex');
    const studentId = JSON.parse(localStorage.getItem('Profile')).profile.rollno;
    let value = await API.post(`/register/${studentId}/${currIndex}`);
    handleButton();
  }

  useEffect(() => {
    // Function to execute on page load
    handleButton();
  }, []);

  const handleButton = () => {
    const currIndex = JSON.parse(localStorage.getItem('currIndex'));
    let role = JSON.parse(localStorage.getItem('Profile')).profile.role;
    let Id = null;
    if (role === 'teacher') {
      Id = JSON.parse(localStorage.getItem('Profile')).profile.t_id;
    } else {
      Id = JSON.parse(localStorage.getItem('Profile')).profile.rollno;
      setIsTeacher(true);
    }
    API.get(`/status/${role}/${Id}/${currIndex}`)
      .then(response => {
        if (response.data.status === true) {
          setIsLoading(true);
        }
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  return (
    <>
      {
        isData.filter((e) => { return JSON.stringify(e.id) === localStorage.getItem('currIndex') }).map((e) => {
          return (
            <>
              <div>
                <DescHeader />
                <p className='due-date-head'>Due {e.dueDate}</p>
                <p className='desc-title'>{e.title}</p>
                <p className='desc-below'> Staff Name <span className='desc-dot'>&#9679;</span> Posted On</p>
                <span className='split-line'></span>
                <p className='desc'>{e.description}</p>
                {
                  isTeacher &&
                  <>
                    <div className='submit-hold' id='sub-hold'>
                      <div className='submit-cont-hold'>
                        <p className='your-work'>Your Work</p>
                        <p className='due-date'>{e.dueDate}</p>
                      </div>
                      <button className='register-btn' id='btn-for-register' onClick={handleRegister} disabled={isLoading}>Registered</button>
                    </div>
                  </>
                }
              </div >
            </>
          )
        })
      }
    </>
  )
}

export default Description