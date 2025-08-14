'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './profile.css';

const EditProfileButton = ({ isOwnProfile }) => {
  const router = useRouter();
  
  if (!isOwnProfile) return null;

  const handleEditProfile = () => {
    router.push('/setup_profile');
  };

  return (
    <div className="edit-button-container">
      <button className="edit-profile-button" onClick={handleEditProfile}>
        Edit profile
      </button>
    </div>
  );
};

export default EditProfileButton;
