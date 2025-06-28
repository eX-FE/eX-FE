import React from 'react';
import './profile.css';

const Avatar = ({ avatarUrl }) => {
  return (
    <div className="avatar-wrapper">
      <img src={avatarUrl} alt="User avatar" className="avatar" />
    </div>
  );
};

export default Avatar;
