import React, { useState } from 'react';
import './profile.css';

const tabs = ['Posts', 'Replies', 'Media', 'Likes'];

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('Posts');

  return (
    <div className="profile-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
