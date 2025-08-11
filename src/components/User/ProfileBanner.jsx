import React from 'react';
import './profile.css';

const ProfileBanner = ({ bannerUrl }) => (
  <div className="profile-banner">
    <img src={bannerUrl} alt="Profile banner" className="banner-image" />
  </div>
);

export default ProfileBanner;
