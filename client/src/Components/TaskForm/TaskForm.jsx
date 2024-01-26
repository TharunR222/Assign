import React from 'react'
import { Button, DatePicker, Form, Input, Cascader } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

const TaskForm = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const t_id = JSON.parse(localStorage.getItem('Profile')).profile.t_id;
    let date = new Date().toJSON();
    API.post(`/taskpost/${t_id}/${date}`, values)
      .then(response => {
        console.log('Success:', response.data);
        navigate("/home");
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const options = [
    {
      value: '1',
      label: '1',
      children: [
        {
          value: 'CSE',
          label: 'CSE',
        },
        {
          value: 'IT',
          label: 'IT',
        },
        {
          value: 'All',
          label: 'All',
        },
      ],
    },
    {
      value: '2',
      label: '2',
      children: [
        {
          value: 'CSE',
          label: 'CSE',
        },
        {
          value: 'IT',
          label: 'IT',
        },
        {
          value: 'All',
          label: 'All',
        },
      ],
    },
    {
      value: '3',
      label: '3',
      children: [
        {
          value: 'CSE',
          label: 'CSE',
        },
        {
          value: 'IT',
          label: 'IT',
        },
        {
          value: 'All',
          label: 'All',
        },
      ],
    },
    {
      value: '4',
      label: '4',
      children: [
        {
          value: 'CSE',
          label: 'CSE',
        },
        {
          value: 'IT',
          label: 'IT',
        },
        {
          value: 'All',
          label: 'All',
        },
      ],
    },
  ];

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      style={{
        maxWidth: 400,
        boxShadow: "0.5px 0.5px 10px 0px",
        borderRadius: "10px",
        padding: "10px",
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please input the title of the task to be assigned!',
          },
        ]}
      >
        <Input placeholder="Title of the task" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            message: 'Please input the detailed description of the assigned task!',
          },
        ]}
      >
        <Input.TextArea rows={4} placeholder="Description of the task" />
      </Form.Item>

      <Form.Item
        label="Department-Year"
        name="assignSel"
        rules={[
          {
            required: true,
            message: 'Please input the appropriate',
          },
        ]}>
        <Cascader
          style={{
            width: '100%',
          }}
          options={options}
          multiple
          maxTagCount="responsive"
        />

      </Form.Item>


      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[
          {
            required: true,
            message: 'Please select a due date for the task!'
          }

        ]}>
        <DatePicker />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 9,
          span: 8,
        }}
      >
        <Button type="primary" htmlType="submit">
          Assign
        </Button>
      </Form.Item>
    </Form>
  );
}


export default TaskForm
