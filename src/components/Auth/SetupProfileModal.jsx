'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../app/login/login.css';
import { useUser } from '../../context/UserContext';
import ProfileStepShell from './ProfileStepShell';

export default function SetupProfileModal({ onClose }) {
  const router = useRouter();
  const { updateProfile } = useUser();

  // Steps: 0=avatar, 1=header, 2=bio, 3=location, 4=save
  const [step, setStep] = useState(0);

  const [avatarFile, setAvatarFile] = useState(null);
  const [headerFile, setHeaderFile] = useState(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState('');
  const [headerDataUrl, setHeaderDataUrl] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const avatarInputRef = useRef(null);
  const headerInputRef = useRef(null);

  function handleClose() { if (onClose) onClose(); }
  function next() { setStep((s) => Math.min(s + 1, 4)); }
  function prev() { setStep((s) => Math.max(s - 1, 0)); }

  function openAvatarPicker() { if (avatarInputRef.current) { avatarInputRef.current.value = ''; avatarInputRef.current.click(); } }
  function openHeaderPicker() { if (headerInputRef.current) { headerInputRef.current.value = ''; headerInputRef.current.click(); } }

  function readAsDataURL(file, cb) {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result?.toString() || '');
    reader.readAsDataURL(file);
  }

  function onAvatarChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      readAsDataURL(file, setAvatarDataUrl);
      // Do not upload here; we keep images local to avoid 413
    }
  }
  function onHeaderChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setHeaderFile(file);
      readAsDataURL(file, setHeaderDataUrl);
      // Do not upload here; we keep images local to avoid 413
    }
  }

  function clearAvatar() { setAvatarFile(null); setAvatarDataUrl(''); if (avatarInputRef.current) avatarInputRef.current.value = ''; }
  function clearHeader() { setHeaderFile(null); setHeaderDataUrl(''); if (headerInputRef.current) headerInputRef.current.value = ''; }

  function topControl() {
    return (
      <button aria-label={step === 0 ? 'Close' : 'Back'} className="modal-close" onClick={step === 0 ? handleClose : prev}>
        {step === 0 ? (
          '×'
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>
    );
  }

  function ActionButtons({ onReplace, onDelete }) {
    return (
      <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', display:'flex', gap:12 }}>
        <button aria-label="Replace image" onClick={onReplace} style={{ width:40, height:40, borderRadius:'50%', border:'1px solid #2f3336', background:'#0f1419', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e7e9ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h4l2-2h4l2 2h4v12H4z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </button>
        <button aria-label="Delete image" onClick={onDelete} style={{ width:40, height:40, borderRadius:'50%', border:'1px solid #2f3336', background:'#0f1419', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e7e9ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </button>
      </div>
    );
  }

  async function handleSave() {
    try {
      // Send only text fields to backend to avoid 413
      await updateProfile({
        bio: (bio || '').trim() || undefined,
        location: (location || '').trim() || undefined,
      });

      // Update local user avatar/banner with chosen images (front-only)
      const nextAvatarUrl = avatarDataUrl || (avatarFile ? URL.createObjectURL(avatarFile) : '');
      const nextBannerUrl = headerDataUrl || (headerFile ? URL.createObjectURL(headerFile) : '');
      if (nextAvatarUrl || nextBannerUrl) {
        if (typeof window !== 'undefined') {
          const evt = new CustomEvent('user-profile-local-images', { detail: { avatarUrl: nextAvatarUrl, bannerUrl: nextBannerUrl } });
          window.dispatchEvent(evt);
        }
      }

      handleClose();
    } catch {
      handleClose();
    }
  }

  // Render steps using the shell
  const hasAvatar = !!avatarFile || !!avatarDataUrl;
  const hasHeader = !!headerFile || !!headerDataUrl;
  const hasBio = (bio || '').trim().length > 0;
  const hasLocation = (location || '').trim().length > 0;

  if (step === 0) {
    const preview = hasAvatar ? (avatarDataUrl || (avatarFile ? URL.createObjectURL(avatarFile) : '')) : null;
    return (
      <ProfileStepShell topControl={topControl()} actionLabel={hasAvatar ? 'Next' : 'Skip for now'} onAction={next}>
        <div className="modal-logo" aria-hidden>
          <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
          <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
        </div>
        <h2 className="modal-title" style={{ textAlign: 'left' }}>Pick a profile picture</h2>
        <p className="legal-text" style={{ marginTop: 0 }}>Have a favorite selfie? Upload it now.</p>
        <div style={{ display:'flex', justifyContent:'center', margin:'24px 0' }}>
          <div style={{ position:'relative' }}>
            <div onClick={openAvatarPicker} style={{ width: 220, height: 220, borderRadius: '50%', border:'2px solid #e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', background:'#111', overflow:'hidden', cursor:'pointer' }} aria-label="Upload profile picture">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="avatar preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e7e9ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h4l2-2h4l2 2h4v12H4z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              )}
            </div>
            {!preview ? (
              // Single camera button before upload
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', border:'1px solid #2f3336', background:'rgba(15,20,25,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}></div>
              </div>
            ) : (
              <ActionButtons onReplace={openAvatarPicker} onDelete={clearAvatar} />
            )}
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" onChange={onAvatarChange} style={{ display:'none' }} />
      </ProfileStepShell>
    );
  }

  if (step === 1) {
    const preview = hasHeader ? (headerDataUrl || (headerFile ? URL.createObjectURL(headerFile) : '')) : null;
    return (
      <ProfileStepShell topControl={topControl()} actionLabel={hasHeader ? 'Next' : 'Skip for now'} onAction={next}>
        <div className="modal-logo" aria-hidden>
          <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
          <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
        </div>
        <h2 className="modal-title" style={{ textAlign: 'left' }}>Pick a header</h2>
        <p className="legal-text" style={{ marginTop: 0 }}>People who visit your profile will see it. Show your style.</p>
        <div style={{ display:'flex', justifyContent:'center', margin:'24px 0' }}>
          <div style={{ position:'relative', width: '100%', maxWidth: 560 }}>
            <div onClick={openHeaderPicker} style={{ width: '100%', height: 180, borderRadius: 12, border:'2px dashed #2f3336', background:'#111', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', cursor:'pointer' }} aria-label="Upload header image">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="header preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e7e9ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16v10H4z"/>
                  <path d="M4 15l4-4 3 3 5-5 4 4"/>
                </svg>
              )}
            </div>
            {!preview ? (
              // Centered camera button before upload
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', border:'1px solid #2f3336', background:'rgba(15,20,25,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}></div>
              </div>
            ) : (
              <ActionButtons onReplace={openHeaderPicker} onDelete={clearHeader} />
            )}
          </div>
        </div>
        <input ref={headerInputRef} type="file" accept="image/*" onChange={onHeaderChange} style={{ display:'none' }} />
      </ProfileStepShell>
    );
  }

  if (step === 2) {
    return (
      <ProfileStepShell topControl={topControl()} actionLabel={hasBio ? 'Next' : 'Skip for now'} onAction={next}>
        <div className="modal-logo" aria-hidden>
          <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
          <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
        </div>
        <h2 className="modal-title" style={{ textAlign: 'left' }}>Describe yourself</h2>
        <p className="legal-text" style={{ marginTop: 0 }}>What makes you special? Don't think too hard, just have fun with it.</p>
        <textarea className="modal-textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} placeholder="Your bio" style={{ marginTop: 5 }} />
      </ProfileStepShell>
    );
  }

  if (step === 3) {
    return (
      <ProfileStepShell topControl={topControl()} actionLabel={hasLocation ? 'Next' : 'Skip for now'} onAction={next}>
        <div className="modal-logo" aria-hidden>
          <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
          <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
        </div>
        <h2 className="modal-title" style={{ textAlign: 'left' }}>Where do you live?</h2>
        <p className="legal-text" style={{ marginTop: 0 }}>Find accounts in the same location as you.</p>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="modal-input" style={{ width:'100%', marginTop:12 }} />
      </ProfileStepShell>
    );
  }

  return (
    <ProfileStepShell topControl={topControl()} actionLabel="Save" onAction={handleSave}>
      <div className="modal-logo" aria-hidden>
        <Image className="modal-logo-light" src="/x-logo.svg" alt="X" width={28} height={28} priority />
        <Image className="modal-logo-dark" src="/x-logo-white.png" alt="X" width={28} height={28} priority />
      </div>
      <h2 className="modal-title" style={{ textAlign: 'left' }}>Click to save updates</h2>
    </ProfileStepShell>
  );
} 