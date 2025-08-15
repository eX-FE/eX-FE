'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Avatar from '../../../components/User/Avatar';
import FollowStats from '../../../components/User/FollowStats';
import ProfileBanner from '../../../components/User/ProfileBanner';
import ProfileHeader from '../../../components/User/ProfileHeader';
import ProfileTabs from '../../../components/User/ProfileTabs';
import UserInfo from '../../../components/User/UserInfo';
import '../../../components/User/profile.css';
import { useUser } from '../../../context/UserContext';
import { followUser, unfollowUser } from '../../../utils/api';

export default function UserProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, isLoading } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateLocalUser } = useUser();

  const [isFollowing, setIsFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const initializedFollowing = useRef(false);

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

  // derive initial following state from the profileUser when it loads
  useEffect(() => {
    if (profileUser && currentUser && !initializedFollowing.current) {
      // profileUser may contain a boolean 'isFollowed' or 'following' flag from search results
      setIsFollowing(Boolean(profileUser.isFollowed === true || profileUser.following === true));
      initializedFollowing.current = true;
    }
  }, [profileUser, currentUser]);

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
            <span className="more-ellipsis" aria-hidden>...</span>
          </button>
          <button
            className="follow-button"
            disabled={actionLoading}
            onClick={async () => {
              if (!currentUser) return router.push('/login');
              setActionLoading(true);
              setError(null);
              // Optimistic update: immediately reflect the UI change
              if (!isFollowing) {
                setIsFollowing(true);
                setProfileUser((prev) => ({ ...prev, followers: (prev.followers ?? 0) + 1, isFollowed: true }));
                // locally increment current user's following count
                updateLocalUser({ following: (currentUser.following ?? 0) + 1 });
                try {
                  const res = await followUser(profileUser.username);
                  // reconcile with server response
                  if (res.actor) updateLocalUser(res.actor);
                  setProfileUser((prev) => ({ ...prev, followers: res.target?.followers ?? prev.followers, isFollowed: true }));
                } catch (err) {
                  // revert optimistic updates on error
                  setIsFollowing(false);
                  setProfileUser((prev) => ({ ...prev, followers: Math.max(0, (prev.followers ?? 1) - 1), isFollowed: false }));
                  updateLocalUser({ following: Math.max(0, (currentUser.following ?? 1) - 1) });
                  setError(err.message || 'Follow failed');
                } finally {
                  setActionLoading(false);
                }
              } else {
                // currently following -> optimistic unfollow
                setIsFollowing(false);
                setProfileUser((prev) => ({ ...prev, followers: Math.max(0, (prev.followers ?? 1) - 1), isFollowed: false }));
                updateLocalUser({ following: Math.max(0, (currentUser.following ?? 1) - 1) });
                try {
                  const res = await unfollowUser(profileUser.username);
                  if (res.actor) updateLocalUser(res.actor);
                  setProfileUser((prev) => ({ ...prev, followers: res.target?.followers ?? prev.followers, isFollowed: false }));
                } catch (err) {
                  // revert optimistic changes on error
                  setIsFollowing(true);
                  setProfileUser((prev) => ({ ...prev, followers: (prev.followers ?? 0) + 1, isFollowed: true }));
                  updateLocalUser({ following: (currentUser.following ?? 0) + 1 });
                  setError(err.message || 'Unfollow failed');
                } finally {
                  setActionLoading(false);
                }
              }
            }}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
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