import React from 'react';
import './profile.css';

const UserInfo = ({ name, username, joinDate }) => (
  <div className="user-info">
    <h2 className="display-name">{name}</h2>
    <p className="username">@{username}</p>
    <p className="join-date">Joined {joinDate}</p>
  </div>
);

export default UserInfo;
