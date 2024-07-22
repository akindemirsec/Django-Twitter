import React, { useEffect, useState } from 'react';
import { FaHome, FaBell, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import logo from './media/logo.png';

const MenuContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  width: 200px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;

  @media (max-width: 768px) {
    left: 10px;
    width: 150px;
    padding: 15px;
  }

  @media (max-width: 576px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px;
    border-radius: 0;
    transform: none;
  }
`;

const Logo = styled.img`
  width: 80px;
  margin-bottom: 20px;

  @media (max-width: 576px) {
    width: 50px;
    margin-bottom: 0;
  }
`;

const MenuItem = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  margin: 15px 0;
  display: flex;
  align-items: center;
  font-size: 1.5em;
  font-weight: bold;

  & svg {
    margin-right: 10px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: 15px;
  }

  @media (max-width: 576px) {
    font-size: 1em;
    margin: 0;
    padding: 5px;

    & svg {
      margin-right: 5px;
    }

    & + & {
      border-top: none;
      padding-top: 0;
    }
  }
`;

const Menu = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('There was an error fetching the user info!', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <MenuContainer>
      <Logo src={logo} alt="Logo" />
      <MenuItem to="/">
        <FaHome />
        Home
      </MenuItem>
      <MenuItem to="/notifications">
        <FaBell />
        Notifications
      </MenuItem>
      {username && (
        <MenuItem to={`/profile/${username}`}>
          <FaUser />
          Profile
        </MenuItem>
      )}
    </MenuContainer>
  );
};

export default Menu;
