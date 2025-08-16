'use client';

import { useState } from 'react';
import Avatar from '../../components/User/Avatar';
import EditProfileButton from '../../components/User/EditProfileButton';
import FollowStats from '../../components/User/FollowStats';
import ProfileBanner from '../../components/User/ProfileBanner';
import ProfileHeader from '../../components/User/ProfileHeader';
import ProfileTabs from '../../components/User/ProfileTabs';
import UserInfo from '../../components/User/UserInfo';
import '../../components/User/profile.css';

export default function ProfilePage() {
  const [user] = useState({
    name: 'A Renaissance Human',
    username: 'NoMorePandAss',
    joinDate: 'June 2025',
    followers: 4034,
    following: 200,
    posts: 4034,
    bannerUrl: 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_2400/https://blog.snappa.com/wp-content/uploads/2024/01/X-Header-Blog-Featured-Image.jpg',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/MIYAVI_from_%22American_Airlines%22_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2019_%2849013892946%29_%28cropped%29.jpg/1200px-MIYAVI_from_%22American_Airlines%22_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2019_%2849013892946%29_%28cropped%29.jpg',
    isOwnProfile: true,
  });

  return (
    <div className="profile-page">
      <ProfileHeader name={user.name} postCount={user.posts} />
      
      <ProfileBanner bannerUrl={user.bannerUrl} />

      <div className="avatar-positioning">
        <Avatar avatarUrl={user.avatarUrl} />
      </div>

      <EditProfileButton isOwnProfile={user.isOwnProfile} />

      <UserInfo 
        name={user.name} 
        username={user.username} 
        joinDate={user.joinDate} 
      />

      <FollowStats 
        followers={user.followers} 
        following={user.following} 
      />

      <ProfileTabs />
    </div>
  );
}
