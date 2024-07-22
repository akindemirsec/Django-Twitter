import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import TweetForm from './TweetForm';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const TweetContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const TweetList = () => {
  const [tweets, setTweets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTweets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tweets/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTweets(response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (error) {
        console.error('There was an error fetching the tweets!', error);
      }
    };

    fetchTweets();
  }, []);

  const handleTweetPosted = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleLike = async (tweetId, liked) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      if (liked) {
        await axios.delete(`http://127.0.0.1:8000/api/tweets/${tweetId}/like/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`http://127.0.0.1:8000/api/tweets/${tweetId}/like/`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setTweets(tweets.map(tweet => tweet.id === tweetId ? { ...tweet, likes: liked ? tweet.likes - 1 : tweet.likes + 1, liked: !liked } : tweet));
    } catch (error) {
      console.error('There was an error liking the tweet!', error);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <TweetForm onTweetPosted={handleTweetPosted} />
        {tweets.map(tweet => (
          <TweetContainer key={tweet.id}>
            <TweetHeader>
              <ProfileImage
                src={tweet.profile_image.startsWith('http') ? tweet.profile_image : `http://127.0.0.1:8000${tweet.profile_image}`}
                alt="Profile"
                onClick={() => navigate(`/profile/${tweet.user}`)}
              />
              <UserName onClick={() => navigate(`/profile/${tweet.user}`)}>{tweet.user}</UserName>
            </TweetHeader>
            <TweetContent>{tweet.content}</TweetContent>
            <small>{new Date(tweet.created_at).toLocaleString()}</small>
            <LikeButton liked={tweet.liked} onClick={() => handleLike(tweet.id, tweet.liked)}>
              <FaHeart /> {tweet.likes}
            </LikeButton>
          </TweetContainer>
        ))}
      </ContentWrapper>
    </Container>
  );
};

export default TweetList;
