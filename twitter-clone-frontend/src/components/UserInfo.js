import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const UserInfoContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const UserName = styled.div`
  font-size: 1em;
  font-weight: bold;
`;

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/user/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('User info fetched:', response.data);
      setUser(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the user info!', error);
    });
  }, []);

  if (!user) return null;

  const profileImageUrl = user.profile.profile_image.startsWith('http')
    ? user.profile.profile_image
    : `http://127.0.0.1:8000${user.profile.profile_image}`;

  return (
    <UserInfoContainer onClick={() => navigate(`/profile/${user.username}`)}>
      <ProfileImage src={profileImageUrl} alt="Profile" />
      <UserName>{user.username}</UserName>
    </UserInfoContainer>
  );
};

export default UserInfo;