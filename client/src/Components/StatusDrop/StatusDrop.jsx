import React from 'react'
import caretImage from "../../assets/caret-down.png"
import "./StatusDrop.css"
import StatusTask from '../StatusTask/StatusTask'
import { useEffect, useState, createContext } from 'react'
import axios from 'axios'

const API = axios.create({ baseURL: "http://127.0.0.1:5000" })

export const TaskByDateContext = createContext({});

const StatusDrop = () => {

  const [isShowTask, setShowTask] = useState([]);
  const [isTasks, setTasks] = useState([]);


  function handleShowTask(e, el) {
    console.log("index", isShowTask);
    el.stopPropagation();
    const indexval = isShowTask.findIndex((btn) => { return btn.id === e.date });
    // console.log("indexval")
    if (indexval !== -1) {
      // Object already exists in the array
      const updatedShowData = [...isShowTask];
      updatedShowData[indexval].clicked = !updatedShowData[indexval].clicked;
      setShowTask(updatedShowData);
    } else {
      // Object does not exist in the array
      const newShowData = [
        ...isShowTask,
        { id: e.date, clicked: true },
      ];
      setShowTask(newShowData);
    }
  };

  useEffect(() => {
    fetchTasksByDate();
  }, [])

  const fetchTasksByDate = async () => {
    let t_id = JSON.parse(localStorage.getItem('Profile')).profile.t_id;
    let response = await API.get(`/tasksByDate/${t_id}`);
    let tasksByDate = response.data.tasks;
    setTasks(tasksByDate);
  }

  return (
    <>
      {
        isTasks.map((e) => {
          return (
            <>
              <div className='drop-down-hold'>
                <p className='drop-date-hold'>Date Posted:{e.date}</p>
                <div className='caret-image-hold'><span className='drop-count-post'>{e.tasks.length}</span><img src={caretImage} alt='caretDown' onClick={(el) => handleShowTask(e, el)} /></div>
              </div>
              {
                isShowTask.map((val) => {
                  return (
                    val.id === e.date &&
                    val.clicked &&
                    <TaskByDateContext.Provider value={e.tasks}><StatusTask /></TaskByDateContext.Provider>)
                })
              }
            </>
          );
        })
      }
    </>
  )
}

export default StatusDrop