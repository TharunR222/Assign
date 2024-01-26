import React, { createContext } from 'react';
import "./StatusTask.css";
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import Assignment from '../../assets/assignment.png';
import caretImage from "../../assets/caret-down.png";
import DisplayStudent from '../DisplayStudent/DisplayStudent';
import { TaskByDateContext } from '../StatusDrop/StatusDrop';

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

export const StudentByTaskContext = createContext();


const StatusTask = () => {
  const [isStudentData, setStudentData] = useState([]);

  function showStudentData(e, el) {
    console.log(e);
    el.stopPropagation();
    const index = isStudentData.findIndex((btn) => { return btn.id === e.t_id });

    if (index !== -1) {
      // Object already exists in the array
      const updatedStudentData = [...isStudentData];
      updatedStudentData[index].clicked = !updatedStudentData[index].clicked;
      setStudentData(updatedStudentData);
    } else {
      // Object does not exist in the array
      const newStudentData = [
        ...isStudentData,
        { id: e.t_id, clicked: true },
      ];
      setStudentData(newStudentData);
    }
  };

  const [isData, setIsData] = useState([]);
  useEffect(() => {
    hdata();
  }, []);

  const hdata = async () => {
    const Id = JSON.parse(localStorage.getItem('Profile')).profile.t_id;
    let response = await API.get(`/tasks/${'teacher'}/${Id}`);
    let jsonData = response.data.task;
    setIsData(jsonData);
  };

  const navigate = useNavigate();

  const tasksByDate = useContext(TaskByDateContext);
  let trueStatusCount = 0;

  return (
    <>
      {/* {console.log(tasksByDate)} */}
      {
        tasksByDate.map((e) => {
          // console.log(e.student)
          {
            trueStatusCount = 0;
            e.student.forEach((student) => {
              if (student.status === true) {
                trueStatusCount++;
              }
            });
          }
          return (
            <>
              <div className='status-hold-main' key={e.id}>
                <div onClick={() => {
                  localStorage.setItem('currIndex', JSON.stringify(e.t_id));
                  navigate("/desc");
                }}>
                  <div className='status-hold'>
                    <span className='stat-title-hold'>
                      <Avatar backgroundColor='white' px='10px' py='10px' borderRadius='50%'><img src={Assignment} alt='assign' className='assign-logo' /></Avatar>
                      <p className='status-title-hold'>{e.title}</p>
                    </span>
                    <div className='status-det-hold'>
                      <p>Assigned<span>{"   " + `${e.student.length}`}</span></p>
                      <p onClick={(el) => showStudentData(e, el)}>Completed<span>{"   " + `${trueStatusCount}/${e.student.length}`}</span><span><img src={caretImage} alt="caretImage" className='caret-image-hold-stat' /></span></p>
                    </div>
                  </div>
                  <p className='status-assign-date'>Assigned on {"Need To Check"}</p>
                </div>
              </div>
              {
                isStudentData.map((stud) => {

                  return (
                    stud.id === e.t_id && stud.clicked && (<StudentByTaskContext.Provider value={e.student}>
                      <DisplayStudent />
                    </StudentByTaskContext.Provider >)
                  );
                })
              }
            </>
          )
        })
      }
    </>
  );
}

export default StatusTask;
