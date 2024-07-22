import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const NotificationContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const NotificationMessage = styled.p`
  font-size: 1.2em;
`;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('There was an error fetching the notifications!', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Container>
      {notifications.map(notification => (
        <NotificationContainer key={notification.id}>
          <NotificationHeader>
            <ProfileImage
              src={notification.sender_profile_image.startsWith('http') ? notification.sender_profile_image : `http://127.0.0.1:8000${notification.sender_profile_image}`}
              alt="Profile"
            />
            <UserName>{notification.sender_username}</UserName>
          </NotificationHeader>
          <NotificationMessage>{notification.message}</NotificationMessage>
        </NotificationContainer>
      ))}
    </Container>
  );
};

export default Notifications;
