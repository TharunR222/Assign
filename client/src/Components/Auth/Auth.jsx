import React from 'react';
import { Button, Form, Input, Radio } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

const Auth = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    API.post("/rolepost", values)
      .then(response => {
        console.log('Success:', response.data);
        if (response.data.return === true) {
          localStorage.setItem("Profile", JSON.stringify(response.data));
          navigate("/home");
        }
        else {
          alert("Invalid Credential! Please try again");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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
        maxWidth: 300,
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
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 3,
          span: 16,
        }}
        rules={[{ required: true, message: "Please select an option!" }]}
        label="Role"
        name="role">
        <Radio.Group>
          <Radio value="student"> Student </Radio>
          <Radio value="teacher"> Teacher </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Auth;