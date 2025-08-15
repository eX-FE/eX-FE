import React from 'react';
import './profile.css';

const Avatar = ({ avatarUrl }) => {
  const hasImage = !!(avatarUrl && avatarUrl.trim().length > 0);
  return (
    <div className="avatar-wrapper">
      {hasImage ? (
      <img src={avatarUrl} alt="User avatar" className="avatar" />
      ) : (
        <div className="avatar" style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'#ccc' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="#888">
            <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;
