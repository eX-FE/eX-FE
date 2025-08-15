'use client';

import { useEffect } from 'react';
import Avatar from '../../components/User/Avatar';
import EditProfileButton from '../../components/User/EditProfileButton';
import FollowStats from '../../components/User/FollowStats';
import ProfileBanner from '../../components/User/ProfileBanner';
import ProfileHeader from '../../components/User/ProfileHeader';
import ProfileTabs from '../../components/User/ProfileTabs';
import UserInfo from '../../components/User/UserInfo';
import '../../components/User/profile.css';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
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

  if (!user) {
    return null;
  }

  const bannerUrl = user.bannerUrl || '';
  const avatarUrl = user.avatarUrl || '';

  return (
    <div className="profile-page">
      <ProfileHeader name={user.name} postCount={user.posts ?? 0} />
      
      <ProfileBanner bannerUrl={bannerUrl} />

      <div className="avatar-positioning">
        <Avatar avatarUrl={avatarUrl} />
      </div>

      <EditProfileButton isOwnProfile={true} />

      <UserInfo 
        name={user.name} 
        username={user.username} 
        joinDate={user.joinDate} 
        bio={user.bio}
        location={user.location}
      />

      <FollowStats 
        followers={user.followers ?? 0} 
        following={user.following ?? 0} 
      />

      <ProfileTabs />
    </div>
  );
}
