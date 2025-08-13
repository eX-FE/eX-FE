import React from 'react';
import './profile.css';

const UserInfo = ({ name, username, joinDate, bio, location }) => (
  <div className="user-info">
    <h2 className="display-name">{name}</h2>
    <p className="username">@{username}</p>
    {bio ? <p className="bio-text">{bio}</p> : null}
    {location ? <p className="location-text">{location}</p> : null}
    <p className="join-date">Joined {joinDate}</p>
  </div>
);

export default UserInfo;
