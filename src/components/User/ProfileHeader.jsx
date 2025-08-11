import React from 'react';
import './profile.css';

const ProfileHeader = ({ name, postCount }) => {
  return (
    <div className="profile-header">
      <button className="back-button">←</button>
      <div className="header-text">
        <h1 className="header-name">{name}</h1>
        <p className="post-count">{postCount} posts</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
