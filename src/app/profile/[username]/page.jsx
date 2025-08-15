'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Avatar from '../../../components/User/Avatar';
import FollowStats from '../../../components/User/FollowStats';
import ProfileBanner from '../../../components/User/ProfileBanner';
import ProfileHeader from '../../../components/User/ProfileHeader';
import ProfileTabs from '../../../components/User/ProfileTabs';
import UserInfo from '../../../components/User/UserInfo';
import '../../../components/User/profile.css';
import { useUser } from '../../../context/UserContext';

export default function UserProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, isLoading } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
      return;
    }

    // If viewing own profile, redirect to /profile
    if (currentUser && username === currentUser.username) {
      router.push('/profile');
      return;
    }

    // Get user data from URL params (passed from search results)
    const getUserFromParams = () => {
      try {
        setLoading(true);
        const userData = searchParams.get('data');
        if (userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          setProfileUser(user);
        } else {
          setError('User data not found');
        }
      } catch (err) {
        setError('Invalid user data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && username) {
      getUserFromParams();
    }
  }, [username, currentUser, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '16px',
        color: '#666'
      }}>
        <h2>User not found</h2>
        <p>The profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const bannerUrl = profileUser.bannerUrl || '';
  const avatarUrl = profileUser.avatarUrl || '';

  return (
    <div className="profile-page">
      <ProfileHeader name={profileUser.name} postCount={profileUser.posts ?? 0} />
      
      <ProfileBanner bannerUrl={bannerUrl} />

      <div className="avatar-positioning">
        <Avatar avatarUrl={avatarUrl} />
      </div>

      {/* Follow and More buttons */}
      <div className="profile-actions">
        <div className="action-buttons">
          <button className="more-button" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8.5c1.93 0 3.5-1.57 3.5-3.5S13.93 1.5 12 1.5 8.5 3.07 8.5 5 10.07 8.5 12 8.5zm0 2c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 7c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/>
            </svg>
          </button>
          <button className="follow-button">
            Follow
          </button>
        </div>
      </div>

      <UserInfo 
        name={profileUser.name} 
        username={profileUser.username} 
        joinDate={profileUser.joinDate} 
        bio={profileUser.bio}
        location={profileUser.location}
      />

      <FollowStats 
        followers={profileUser.followers ?? 0} 
        following={profileUser.following ?? 0} 
      />

      <ProfileTabs />
    </div>
  );
} 