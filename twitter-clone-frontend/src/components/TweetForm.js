import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 15px;
  width: 100%;
  max-width: 600px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 15px;
`;

const TextareaContainer = styled.div`
  flex: 1;
`;

const Textarea = styled.textarea`
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  resize: none;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 30px;
  border: none;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const TweetForm = ({ onTweetPosted }) => {
  const [content, setContent] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
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
        setProfileImage(response.data.profile.profile_image);
      } catch (error) {
        console.error('There was an error fetching the user profile!', error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/tweets/', { content }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onTweetPosted(response.data);
      setContent('');
    } catch (error) {
      console.error('There was an error posting the tweet!', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {profileImage ? (
        <Avatar src={profileImage.startsWith('http') ? profileImage : `http://127.0.0.1:8000${profileImage}`} alt="Profile" />
      ) : (
        <Avatar src="/default-avatar.png" alt="Default Profile" /> // Provide a default avatar image
      )}
      <TextareaContainer>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows="3"
          required
        />
        <ButtonContainer>
          <Button type="submit" disabled={!content.trim()}>
            Tweet
          </Button>
        </ButtonContainer>
      </TextareaContainer>
    </Form>
  );
};

export default TweetForm;
