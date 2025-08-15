import React from 'react';
import './profile.css';

const ProfileBanner = ({ bannerUrl }) => (
  <div className="profile-banner">
    {bannerUrl ? (
      <img src={bannerUrl} alt="Profile banner" className="banner-image" />
    ) : null}
  </div>
);

export default ProfileBanner;
