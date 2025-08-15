'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

function CameraIcon({ size = 28, color = '#536471' }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
			<path d="M9 7l1.5-2h3L15 7h3a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h3z" stroke={color} strokeWidth="1.6" fill="none"/>
			<circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="1.6" fill="none"/>
		</svg>
	);
}

function CloseIcon({ size = 16, color = '#ffffff' }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
			<path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
		</svg>
	);
}

function EmojiIcon({ size = 18, color = '#1d9bf0' }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
			<circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" fill="none"/>
			<circle cx="9" cy="10" r="1" fill={color}/>
			<circle cx="15" cy="10" r="1" fill={color}/>
			<path d="M8 14c.9 1 2.1 1.6 4 1.6S15.1 15 16 14" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
		</svg>
	);
}

function GifIcon({ size = 18, color = '#1d9bf0' }) {
	return (
		<svg width={size} height={size} viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
			<rect x="1" y="1" width="46" height="18" rx="4" ry="4" fill="none" stroke={color} strokeWidth="2"/>
			<text x="10" y="14" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fontWeight="700" fontSize="12" fill={color}>GIF</text>
		</svg>
	);
}

function DefaultAvatarIcon({ size = 40, color = '#536471' }) {
	return (
		<svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
			<circle cx="24" cy="24" r="23" fill="#e1e8ed" />
			<circle cx="24" cy="20" r="7" fill={color} opacity="0.8"/>
			<path d="M12 38c2.8-6.2 9-10 12-10s9.2 3.8 12 10" fill={color} opacity="0.6"/>
		</svg>
	);
}

export default function ProfileSetupModal({ onClose }) {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [profileImage, setProfileImage] = useState(null);
	const [headerImage, setHeaderImage] = useState(null);
	const [bio, setBio] = useState('');
	const [location, setLocation] = useState('');
	
	const profileFileInputRef = useRef(null);
	const headerFileInputRef = useRef(null);

	const handleProfileImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProfileImage(imageUrl);
		}
	};

	const handleHeaderImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setHeaderImage(imageUrl);
		}
	};

	const handleNextStep = () => {
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleSkipStep = () => {
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleSave = () => {
		console.log('Saving profile data:', { profileImage, headerImage, bio, location });
		onClose();
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<>
						<h2 className="modal-title">Pick a profile picture</h2>
						<p className="modal-subtitle">Have a favorite selfie? Upload it now.</p>
						<div className="profile-picture-upload">
							<div className="profile-picture-circle" onClick={() => profileFileInputRef.current?.click()}>
								{profileImage ? (
									<>
										<img src={profileImage} alt="Profile" className="uploaded-image" />
										<button 
											className="remove-image-btn"
											onClick={(e) => {
												e.stopPropagation();
												setProfileImage(null);
											}}
										>
											<CloseIcon />
										</button>
									</>
								) : (
									<div className="camera-icon"><CameraIcon /></div>
								)}
							</div>
							<input
								ref={profileFileInputRef}
								type="file"
								accept="image/*"
								onChange={handleProfileImageUpload}
								style={{ display: 'none' }}
							/>
						</div>

						<button 
							className="primary-btn"
							onClick={profileImage ? handleNextStep : handleSkipStep}
						>
							{profileImage ? 'Next' : 'Skip for now'}
						</button>
					</>
				);

			case 2:
				return (
					<>
						<h2 className="modal-title">Pick a header</h2>
						<p className="modal-subtitle">People who visit your profile will see it. Show your style.</p>
						<div className="header-picture-upload">
							<div className="header-picture-area" onClick={() => headerFileInputRef.current?.click()}>
								{headerImage ? (
									<>
										<img src={headerImage} alt="Header" className="uploaded-header" />
										<button 
											className="remove-header-btn"
											onClick={(e) => {
												e.stopPropagation();
												setHeaderImage(null);
											}}
										>
											<CloseIcon />
										</button>
									</>
								) : (
									<div className="camera-icon"><CameraIcon /></div>
								)}
							</div>
							<input
								ref={headerFileInputRef}
								type="file"
								accept="image/*"
								onChange={handleHeaderImageUpload}
								style={{ display: 'none' }}
							/>
						</div>

						<div className="profile-preview">
							<div className="profile-picture-small">
								{profileImage ? (
									<img src={profileImage} alt="Profile" className="uploaded-image-small" />
								) : (
									<div className="default-avatar"><DefaultAvatarIcon size={40} /></div>
								)}
							</div>
							<div className="profile-info-preview">
								<div className="profile-name">len</div>
								<div className="profile-username">@lendevicorn</div>
							</div>
						</div>

						<button 
							className="primary-btn"
							onClick={headerImage ? handleNextStep : handleSkipStep}
						>
							{headerImage ? 'Next' : 'Skip for now'}
						</button>
					</>
				);

			case 3:
				return (
					<>
						<h2 className="modal-title">Describe yourself</h2>
						<p className="modal-subtitle">What makes you special? Don't think too hard, just have fun with it.</p>
						<div className="bio-input-container">
							<textarea
								className="bio-textarea"
								placeholder="Your bio"
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								maxLength={160}
							/>
							<div className="char-count">{bio.length} / 160</div>
							<div className="bio-icons">
								<span className="emoji-icon" aria-hidden><EmojiIcon /></span>
								<span className="gif-icon" aria-hidden><GifIcon /></span>
							</div>
						</div>

						<button 
							className="primary-btn"
							onClick={bio.trim() ? handleNextStep : handleSkipStep}
						>
							{bio.trim() ? 'Next' : 'Skip for now'}
						</button>
					</>
				);

			case 4:
				return (
					<>
						<h2 className="modal-title">Where do you live?</h2>
						<p className="modal-subtitle">Find accounts in the same location as you.</p>
						<div className="location-input-container">
							<input
								type="text"
								className="modal-input"
								placeholder="Location"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								maxLength={30}
							/>
							<div className="char-count">{location.length} / 30</div>
						</div>

						<button 
							className="primary-btn"
							onClick={location.trim() ? handleNextStep : handleSkipStep}
						>
							{location.trim() ? 'Next' : 'Skip for now'}
						</button>
					</>
				);

			case 5:
				return (
					<>
						<h2 className="modal-title">Click to save updates</h2>
						<button className="save-btn" onClick={handleSave}>
							Save
						</button>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className="auth-overlay">
			<div className="auth-modal profile-setup-modal">
				<div className="modal-header">
					{currentStep < 5 && (
						<button className="modal-close" onClick={onClose} aria-label="Close modal">
							×
						</button>
					)}
					<div className="modal-logo">
						<img 
							src="/x-logo.svg" 
							alt="X" 
							className="modal-logo-light"
						/>
						<img 
							src="/x-logo-white.png" 
							alt="X" 
							className="modal-logo-dark"
						/>
					</div>
				</div>
				<div className="modal-content">
					{renderStepContent()}
				</div>
			</div>
		</div>
	);
} 