'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './profile.css';
import { useUser } from '../../context/UserContext';
import EditProfileModal from '../Auth/EditProfileModal';

const EditProfileButton = ({ isOwnProfile }) => {
  const router = useRouter();
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  
  if (!isOwnProfile) return null;

  const handleEditProfile = () => {
    // Check if user has any profile data (avatar, banner, bio, or location)
    const hasProfileData = !!(
      (user?.avatarUrl && user.avatarUrl.trim()) ||
      (user?.bannerUrl && user.bannerUrl.trim()) ||
      (user?.bio && user.bio.trim()) ||
      (user?.location && user.location.trim())
    );

    if (hasProfileData) {
      // Show edit modal for users with existing data
      setShowEditModal(true);
    } else {
      // Show setup flow for new users
      router.push('/setup_profile');
    }
  };

  return (
    <>
      <div className="edit-button-container">
        <button className="edit-profile-button" onClick={handleEditProfile}>
          Edit profile
        </button>
      </div>
      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </>
  );
};

export default EditProfileButton;
