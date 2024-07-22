import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from './media/logo.png';

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

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 2em;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('birth_date', birthDate);
    formData.append('location', location);
    formData.append('bio', bio);
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/login');
    } catch (error) {
      console.error('There was an error registering!', error);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Logo src={logo} alt="Logo" />
        <Form onSubmit={handleRegister}>
          <Title>Register</Title>
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
          <Input
            type="date"
            placeholder="Birth Date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <Input
            type="text"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button type="submit">Register</Button>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default Register;
