import React from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

const TweetContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const TweetHeader = styled.div`
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
  cursor: pointer;
`;

const UserName = styled.span`
  font-weight: bold;
  cursor: pointer;
`;

const TweetContent = styled.p`
  font-size: 1.2em;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: ${({ liked, theme }) => (liked ? 'red' : theme.colors.text)};
  cursor: pointer;
  display: flex;
  align-items: center;

  & svg {
    margin-right: 5px;
  }
`;

const Tweet = ({ tweet }) => {
  return (
    <TweetContainer>
      <TweetHeader>
        <ProfileImage
          src={tweet.profile_image.startsWith('http') ? tweet.profile_image : `http://127.0.0.1:8000${tweet.profile_image}`}
          alt="Profile"
        />
        <UserName>{tweet.user}</UserName>
      </TweetHeader>
      <TweetContent>{tweet.content}</TweetContent>
      <small>{new Date(tweet.created_at).toLocaleString()}</small>
      <LikeButton liked={tweet.liked}>
        <FaHeart /> {tweet.likes}
      </LikeButton>
    </TweetContainer>
  );
};

export default Tweet;