'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../app/login/login.css';
import { useUser } from '../../context/UserContext';
import { uploadAvatar as apiUploadAvatar, uploadBanner as apiUploadBanner } from '../../utils/api';

export default function EditProfileModal({ onClose }) {
  const { user, updateProfile } = useUser();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  
  // Store files locally until save
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  function handleClose() { if (onClose) onClose(); }

  async function handleSave() {
    try {
      let avatarUrl = user?.avatarUrl;
      let bannerUrl = user?.bannerUrl;

      // Upload avatar if changed
      if (avatarFile) {
        const result = await apiUploadAvatar(avatarFile);
        avatarUrl = result.url;
      }

      // Upload banner if changed
      if (bannerFile) {
        const result = await apiUploadBanner(bannerFile);
        bannerUrl = result.url;
      }

      // Update profile with all changes
      await updateProfile({
        name: name.trim(),
        avatarUrl: avatarUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
      });
      
      handleClose();
    } catch {
      handleClose();
    }
  }

  function readAsDataURL(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result?.toString() || '');
    reader.readAsDataURL(file);
  }

  function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      readAsDataURL(file, setAvatarPreview);
    }
  }

  function onBannerChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      readAsDataURL(file, setBannerPreview);
    }
  }

  function openAvatarPicker() { if (avatarInputRef.current) { avatarInputRef.current.value = ''; avatarInputRef.current.click(); } }
  function openBannerPicker() { if (bannerInputRef.current) { bannerInputRef.current.value = ''; bannerInputRef.current.click(); } }

  const hasAvatar = !!(user?.avatarUrl && user.avatarUrl.trim().length > 0) || !!avatarPreview;
  const hasBanner = !!(user?.bannerUrl && user.bannerUrl.trim().length > 0) || !!bannerPreview;
  const currentAvatarUrl = avatarPreview || user?.avatarUrl;
  const currentBannerUrl = bannerPreview || user?.bannerUrl;

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid #eff3f4',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal" style={{ maxWidth: 600, height: 650, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0px 2px 12px 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button aria-label="Close" onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', marginRight: 25 }}>×</button>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Edit profile</h2>
          </div>
          <button className="primary-btn" onClick={handleSave} style={{ height: 32, padding: '0 16px', fontSize: 14, marginTop: 0, maxWidth: 80 }}>Save</button>
        </div>
        
        <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
          {/* Banner */}
          <div style={{ position: 'relative', height: 200, background: '#cfd9de' }}>
            {hasBanner && <img src={currentBannerUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            <button onClick={openBannerPicker} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M4 7h4l2-2h4l2 2h4v12H4z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </button>
          </div>
          
          {/* Avatar */}
          <div style={{ position: 'relative', margin: '-66px 0 0 16px', width: 132, height: 132 }}>
            <div style={{ width: 132, height: 132, borderRadius: '50%', border: '4px solid white', background: '#cfd9de', overflow: 'hidden', position: 'relative' }}>
              {hasAvatar ? (
                <img src={currentAvatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="#888">
                    <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                  </svg>
                </div>
              )}
              <button onClick={openAvatarPicker} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M4 7h4l2-2h4l2 2h4v12H4z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: '80px 16px 16px' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="modal-input"
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Bio</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                maxLength={160}
                className="modal-textarea"
                style={{ width: '100%', minHeight: 80 }}
              />
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="modal-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Menu Items */}
            <div style={{ borderTop: '1px solid #eff3f4', marginTop: 20 }}>
              <div 
                style={menuItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {/* Handle birth date click */}}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 400, color: '#0f1419' }}>Birth date</div>
                  <div style={{ fontSize: 14, color: '#536471', marginTop: 2 }}>February 2, 1988</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#536471">
                  <path d="M8.5 5.5L15 12l-6.5 6.5L7 17l5-5-5-5z"/>
                </svg>
              </div>

              <div 
                style={menuItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {/* Handle expanded bio click */}}
              >
                <div style={{ fontSize: 16, fontWeight: 400, color: '#0f1419' }}>Create expanded bio</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#536471">
                  <path d="M8.5 5.5L15 12l-6.5 6.5L7 17l5-5-5-5z"/>
                </svg>
              </div>

              <div 
                style={{...menuItemStyle, borderBottom: 'none'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {/* Handle professional click */}}
              >
                <div style={{ fontSize: 16, fontWeight: 400, color: '#0f1419' }}>Switch to professional</div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#536471">
                  <path d="M8.5 5.5L15 12l-6.5 6.5L7 17l5-5-5-5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <input ref={avatarInputRef} type="file" accept="image/*" onChange={onAvatarChange} style={{ display: 'none' }} />
        <input ref={bannerInputRef} type="file" accept="image/*" onChange={onBannerChange} style={{ display: 'none' }} />
      </div>
    </div>
  );
} 