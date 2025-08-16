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
import { followUser, unfollowUser, getFollowing } from '../../../utils/api';
import UnfollowConfirmModal from '../../../components/Auth/UnfollowConfirmModal';

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
  const [showUnfollow, setShowUnfollow] = useState(false);

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
      // Try to infer from passed data first
      const guessed = Boolean(profileUser.isFollowed === true || profileUser.following === true);
      if (guessed) {
        setIsFollowing(true);
        initializedFollowing.current = true;
        return;
      }
      // Fallback to backend check
      (async () => {
        try {
          const res = await getFollowing(currentUser.username);
          const list = res.users || [];
          const exists = list.some(u => (u.username || '').toLowerCase() === (profileUser.username || '').toLowerCase());
          setIsFollowing(exists);
        } catch {
          setIsFollowing(false);
        } finally {
          initializedFollowing.current = true;
        }
      })();
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
                  const res = await followUser((profileUser.username || '').trim());
                  // reconcile with server response
                  if (res.actor) updateLocalUser(res.actor);
                  setProfileUser((prev) => ({ ...prev, followers: res.target?.followers ?? prev.followers, isFollowed: true }));
                } catch (err) {
                  if (err?.code === 'AUTH' || /(Invalid|Missing Authorization|User not found)/i.test(err?.message || '')) {
                    if (typeof window !== 'undefined') localStorage.removeItem('access_token');
                    router.push('/login');
                    return;
                  }
                  // revert optimistic updates on error
                  setIsFollowing(false);
                  setProfileUser((prev) => ({ ...prev, followers: Math.max(0, (prev.followers ?? 1) - 1), isFollowed: false }));
                  updateLocalUser({ following: Math.max(0, (currentUser.following ?? 1) - 1) });
                  setError(err.message || 'Follow failed');
                } finally {
                  setActionLoading(false);
                }
              } else {
                // Open confirmation modal for unfollow
                setActionLoading(false);
                setShowUnfollow(true);
              }
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
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
      {showUnfollow && (
        <UnfollowConfirmModal
          username={(profileUser.username || '').trim()}
          onConfirm={async () => {
            setShowUnfollow(false);
            setActionLoading(true);
            try {
              setIsFollowing(false);
              setProfileUser((prev) => ({ ...prev, followers: Math.max(0, (prev.followers ?? 1) - 1), isFollowed: false }));
              updateLocalUser({ following: Math.max(0, (currentUser.following ?? 1) - 1) });
              const res = await unfollowUser((profileUser.username || '').trim());
              if (res.actor) updateLocalUser(res.actor);
              setProfileUser((prev) => ({ ...prev, followers: res.target?.followers ?? prev.followers, isFollowed: false }));
            } catch (err) {
              if (err?.code === 'AUTH' || /(Invalid|Missing Authorization|User not found)/i.test(err?.message || '')) {
                if (typeof window !== 'undefined') localStorage.removeItem('access_token');
                router.push('/login');
                return;
              }
              setIsFollowing(true);
              setProfileUser((prev) => ({ ...prev, followers: (prev.followers ?? 0) + 1, isFollowed: true }));
              updateLocalUser({ following: (currentUser.following ?? 0) + 1 });
              setError(err.message || 'Unfollow failed');
            } finally {
              setActionLoading(false);
            }
          }}
          onCancel={() => setShowUnfollow(false)}
        />
      )}
    </div>
  );
} 