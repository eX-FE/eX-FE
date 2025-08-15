"use client";

import React from 'react';
import './profile.css';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';

const ProfileHeader = ({ name, postCount }) => {
  const router = useRouter();
  const { user } = useUser();

  const handleBack = () => {
    // If user is logged in, avoid navigating back to auth/create flows
    // when the previous page was a login/signup/create page.
    try {
      if (user) {
        const ref = typeof document !== 'undefined' ? document.referrer : '';
        if (!ref) return; // no referrer -> stay on current view
        let refPath = '';
        try { refPath = new URL(ref).pathname.toLowerCase(); } catch (e) { refPath = String(ref).toLowerCase(); }
        // Block navigation back to any route that looks like an auth/create flow.
        const blockedKeywords = ['login', 'signup', 'auth', 'forgot', 'password_reset', 'create', 'register'];
        if (blockedKeywords.some(k => refPath.includes(k))) {
          return; // don't navigate back to auth/create flows
        }
      }
    } catch (e) {
      // If anything fails, fall back to normal back navigation
      // (this is conservative and ensures back still works)
    }

    router.back();
  };

  return (
    <div className="profile-header">
      <button className="back-button" onClick={handleBack}>←</button>
      <div className="header-text">
        <h1 className="header-name">{name}</h1>
        <p className="post-count">{postCount} posts</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
