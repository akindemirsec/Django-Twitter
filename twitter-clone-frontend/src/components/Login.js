// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('/images/background.webp') no-repeat center center;
  background-size: cover;
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

const Logo = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentDark};
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      localStorage.setItem('token', response.data.access);
      navigate('/');
    } catch (error) {
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <Container>
      <Logo src="/images/logo.png" alt="Logo" />
      <Form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
        <p>Don't you have an account? <a href="/register">Register</a></p>
      </Form>
    </Container>
  );
};

export default Login;
