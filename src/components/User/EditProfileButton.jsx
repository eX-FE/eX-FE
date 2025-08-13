import React from 'react';
import './profile.css';

const EditProfileButton = ({ isOwnProfile }) => {
  if (!isOwnProfile) return null;

  return (
    <div className="edit-button-container">
      <button className="edit-profile-button">Edit profile</button>
    </div>
  );
};

export default EditProfileButton;
