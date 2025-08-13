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

  if (isLoading || !user) {
    return null;
  }

  const bannerUrl = user.bannerUrl || 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_2400/https://blog.snappa.com/wp-content/uploads/2024/01/X-Header-Blog-Featured-Image.jpg';
  const avatarUrl = user.avatarUrl || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';

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
      />

      <FollowStats 
        followers={user.followers ?? 0} 
        following={user.following ?? 0} 
      />

      <ProfileTabs />
    </div>
  );
}
