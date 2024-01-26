from flask import Flask, request
from flask_restful import Api, Resource, reqparse
import json
from flask_cors import CORS
import psycopg2


app = Flask(__name__)
CORS(app)
api = Api(app)

def checkStudentDetails(username, password):
    try:
        conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost", port="5432")
        curr = conn.cursor()
        curr.execute("SELECT rollno, USERNAME, PASSWORD FROM STUDENT WHERE USERNAME = %s AND PASSWORD = %s", (username, password))
        result = curr.fetchone()

        if result:
            return True, result[0]
        else:
            print("Username and password combination doesn't exist")
            return False, None

    except (Exception, psycopg2.Error) as error:
        print("Error fetching data from PostgreSQL table:", error)

    finally:
        # closing database connection
        if conn:
            curr.close()
            conn.close()
            print("PostgreSQL connection is closed")

def checkTeacherDetails(username, password):
    try:
        conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost", port="5432")
        curr = conn.cursor()
        curr.execute("SELECT t_id, USERNAME, PASSWORD FROM TEACHER WHERE USERNAME = %s AND PASSWORD = %s", (username, password))
        result = curr.fetchone()

        if result:
            return True, result[0]
        else:
            print("Username and password combination doesn't exist")
            return False, None

    except (Exception, psycopg2.Error) as error:
        print("Error fetching data from PostgreSQL table:", error)

    finally:
        # closing database connection
        if conn:
            curr.close()
            conn.close()
            print("PostgreSQL connection is closed")

class CheckRole(Resource):
    def post(self):
        args = request.json
        if args["role"] == 'student':
            result = checkStudentDetails(args["username"], args["password"])
            returnVal, rollno = result[0], result[1] 
            args["rollno"] = rollno
        else:
            result = checkTeacherDetails(args["username"], args["password"])
            returnVal, t_id = result[0], result[1] 
            args["t_id"] = t_id
        return {"profile":args, "return": returnVal}

class AddTask(Resource):
    def post(self, t_id, assign_on):
        t_id = int(t_id)
        content = request.json
        print(content)
        try:
            conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost", port="5432")
            curr = conn.cursor()
            curr.execute("INSERT INTO tasks(title, description, due_date, assign_by, assign_on) VALUES(%s, %s, %s, %s, %s)", (content['title'] if 'title' in content else None, content['description'] if 'description' in content else None, content['dueDate'] if 'dueDate' in content else None, t_id, assign_on))
            if curr.rowcount > 0:
                conn.commit()
                print("Insertion Successful")
                curr.execute("SELECT task_id FROM tasks ORDER BY task_id DESC LIMIT 1")
                res = curr.fetchone()
                for vals in content['assignSel']:
                    print(vals)
                    if len(vals) == 1:
                        curr.execute("INSERT INTO task_dept_year(task_id, year) VALUES(%s, %s)", (res[0], int(vals[0])))
                        conn.commit()
                        if curr.rowcount > 0:
                            curr.execute("SELECT rollno FROM student WHERE year = %s", (int(vals[0]),))
                            result = curr.fetchall()
                            for values in result:
                                curr.execute("INSERT INTO assign_student(task_id, rollno) VALUES(%s, %s)", (res[0], values))
                                conn.commit()
                    else:
                        curr.execute("INSERT INTO task_dept_year(task_id, year, dept) VALUES(%s, %s, %s)", (res[0], int(vals[0]), vals[1]))
                        conn.commit() 
                        if curr.rowcount > 0:
                            curr.execute("SELECT rollno FROM student WHERE year = %s AND dept = %s", (int(vals[0]), vals[1]))
                            result = curr.fetchall()
                            for values in result:
                                curr.execute("INSERT INTO assign_student(task_id, rollno) VALUES(%s, %s)", (res[0], values))
                                conn.commit()
            else:
                print("Insertion Unsuccessful")

        except (Exception, psycopg2.Error) as error:
            print("Error fetching data from PostgreSQL table:", error)

        finally:
            # closing database connection
            if conn:
                curr.close()
                conn.close()
                print("PostgreSQL connection is closed")

class Register(Resource):
    def post(self, student_id, task_id):
        try:
            student_id, task_id = int(student_id), int(task_id)
            conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost", port="5432")
            curr = conn.cursor()
            curr.execute("UPDATE assign_student SET status = true WHERE task_id = %s AND rollno = %s", (task_id, student_id))
           
            if curr.rowcount != 0:
                conn.commit()
                return {'status':True}
            else:
                print("Student and Task combination doesn't exist")
                return {'status':False}

        except (Exception, psycopg2.Error) as error:
            print("Error fetching data from PostgreSQL table:", error)

        finally:
            # closing database connection
            if conn:
                curr.close()
                conn.close()
                print("PostgreSQL connection is closed")
    
class Tasks(Resource):
    def get(self, role, id):   
        try:
            id = int(id)
            data = []
            conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost",port="5432")
            curr = conn.cursor()

            # curr.execute("SELECT task_id, title, description, due_date FROM tasks")
            if role == 'student':
                curr.execute("""SELECT tasks.task_id, tasks.title, tasks.description, tasks.due_date FROM tasks JOIN assign_student ON tasks.task_id = assign_student.task_id WHERE assign_student.rollno = %s""", (id, ))
            else:
                curr.execute("SELECT task_id, title, description, due_date FROM tasks WHERE assign_by = %s", (id, ))
            result = curr.fetchall()
            if result:
                for row in result:
                    currDict = {"id": row[0], "title": row[1], "description": row[2], "dueDate": row[3]}
                    data.append(currDict)
                return {'task': data}
            else:
                print("No tasks are available")
                return {'task': data}

        except (Exception, psycopg2.Error) as error:
            print("Error fetching data from PostgreSQL table:", error)

        finally:
            # closing database connection
            if conn:
                curr.close()
                conn.close()
                print("PostgreSQL connection is closed")

class CheckRegisterStauts(Resource):
    def get(self, role, id, task_id):
        try:
            conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost", port="5432")
            curr = conn.cursor()
            if role == 'student':
                curr.execute("SELECT * FROM assign_student WHERE rollno = %s AND task_id = %s AND status = true", (id, task_id))
                result = curr.fetchone()
                print(result)
                if result:
                    return {'status': True}
                else:
                    print("Username and password combination doesn't exist")
                    return {'status':False}
            else:
                return {'status': True}
            

        except (Exception, psycopg2.Error) as error:
            print("Error fetching data from PostgreSQL table:", error)

        finally:
            # closing database connection
            if conn:
                curr.close()
                conn.close()
                print("PostgreSQL connection is closed")

class TasksByDate(Resource):
    def get(self, id):
        try:
            conn = psycopg2.connect(database="assign", user="postgres", password="postgresRoot", host="localhost", port="5432")
            curr = conn.cursor()
            curr.execute("SELECT tasks.due_date, tasks.task_id, tasks.title, tasks.description, student.rollno, student.name, student.dept, assign_student.status FROM tasks JOIN assign_student ON tasks.task_id = assign_student.task_id JOIN student ON assign_student.rollno = student.rollno WHERE assign_by = %s", (id,))
            result = curr.fetchall()
            if result:
                taskByDateDict = []
                for values in result:
                    currDate = next((item for item in taskByDateDict if item['date'] == values[0]), None)
                    if currDate:
                        task = next((task for task in currDate['tasks'] if task['t_id'] == values[1]), None)
                        if task:
                            task['student'].append({'rollno': values[4], 'name': values[5], 'dept': values[6], 'status': values[7]})
                        else:
                            currDate['tasks'].append({
                                't_id': values[1],
                                'title': values[2],
                                'description': values[3],
                                'student': [{'rollno': values[4], 'name': values[5], 'dept': values[6], 'status': values[7]}]
                            })
                    else:
                        currDate = {
                            'date': values[0],
                            'tasks': [{
                                't_id': values[1],
                                'title': values[2],
                                'description': values[3],
                                'student': [{'rollno': values[4], 'name': values[5], 'dept': values[6], 'status': values[7]}]
                            }]
                        }
                        taskByDateDict.append(currDate)
                print(taskByDateDict)
                return {'status': True, 'tasks': taskByDateDict}
            else:
                print("Username and password combination doesn't exist")
                return {'status': False}
            

        except (Exception, psycopg2.Error) as error:
            print("Error fetching data from PostgreSQL table:", error)

        finally:
            # closing database connection
            if conn:
                curr.close()
                conn.close()
                print("PostgreSQL connection is closed")
        
api.add_resource(CheckRole, "/rolepost")
api.add_resource(AddTask,"/taskpost/<int:t_id>/<string:assign_on>")
api.add_resource(Register,"/register/<int:student_id>/<int:task_id>")
api.add_resource(Tasks,"/tasks/<string:role>/<int:id>")
api.add_resource(CheckRegisterStauts, "/status/<string:role>/<int:id>/<int:task_id>")
api.add_resource(TasksByDate, "/tasksByDate/<int:id>")

if __name__ == '__main__':
    app.run(debug=True)

