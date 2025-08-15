import React from 'react';
import Link from 'next/link';
import './profile.css';

const FollowStats = ({ followers, following }) => (
  <div className="follow-stats">
    <Link href="/following" className="stat"><strong>{following}</strong> Following</Link>
    <Link href="/followers" className="stat"><strong>{followers}</strong> Followers</Link>
  </div>
);

export default FollowStats;
