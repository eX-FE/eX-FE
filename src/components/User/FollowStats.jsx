import React from 'react';
import './profile.css';

const FollowStats = ({ followers, following }) => (
  <div className="follow-stats">
    <span className="stat"><strong>{following}</strong> Following</span>
    <span className="stat"><strong>{followers}</strong> Followers</span>
  </div>
);

export default FollowStats;
