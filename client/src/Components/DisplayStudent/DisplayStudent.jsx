import React, { useContext } from 'react'
import "./DisplayStudent.css"
import { StudentByTaskContext } from '../StatusTask/StatusTask';

const DisplayStudent = () => {
  let taskByDate = useContext(StudentByTaskContext);
  console.log(taskByDate)

  return (
    <>
      {
        <table>
          {entireData &&
            taskByDate.map((e) => {
              return (
                <tr>
                  <td>{e.name}</td>
                  <td style={{ width: "10%" }}>{e.dept}</td>
                  <td style={{ width: "30%" }}>{e.status ? 'Completed' : 'Not Completed'}</td>
                </tr>
              )
            })
          }
        </table>
      }
    </>
  );
}

export default DisplayStudent