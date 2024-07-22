import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Tweet from './Tweet'; // Assuming you have a Tweet component to render individual tweets

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const Username = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const Bio = styled.p`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const FollowButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: ${({ isFollowing, theme }) => isFollowing ? theme.colors.secondary : theme.colors.accent};
  color: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ isFollowing, theme }) => isFollowing ? theme.colors.secondaryDark : theme.colors.accentDark};
  }
`;

const UserProfile = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/${username}/`);
        setUserProfile(response.data);

        // Check if the current user is following this profile
        const token = localStorage.getItem('token');
        const followCheckResponse = await axios.get(`http://127.0.0.1:8000/api/user/${username}/check-follow/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsFollowing(followCheckResponse.data.is_following);

        // Fetch user tweets
        const tweetsResponse = await axios.get(`http://127.0.0.1:8000/api/user/${username}/tweets/`);
        setTweets(tweetsResponse.data);
      } catch (error) {
        console.error('There was an error fetching the user profile or tweets!', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem('token');

    try {
      if (isFollowing) {
        await axios.post(`http://127.0.0.1:8000/api/user/${username}/unfollow/`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`http://127.0.0.1:8000/api/user/${username}/follow/`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('There was an error toggling follow state!', error);
    }
  };

  if (!userProfile) return <div>Loading...</div>;

  return (
    <ProfileContainer>
      <ProfileImage src={userProfile.profile.profile_image.startsWith('http') ? userProfile.profile.profile_image : `http://127.0.0.1:8000${userProfile.profile.profile_image}`} alt="Profile" />
      <Username>{userProfile.username}</Username>
      <Bio>{userProfile.profile.bio}</Bio>
      <FollowButton isFollowing={isFollowing} onClick={handleFollowToggle}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </FollowButton>
      {tweets.map(tweet => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </ProfileContainer>
  );
};

export default UserProfile;
