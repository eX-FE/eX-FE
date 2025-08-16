'use client';

import React, { useState, useRef } from 'react';
import { CreateTweetData } from '../types/Tweet';
import styles from './TweetComposer.module.css';

interface TweetComposerProps {
  onTweet: (tweetData: CreateTweetData) => void;
  defaultAuthor?: string;
  defaultAvatarUrl?: string;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ 
  onTweet, 
  defaultAuthor = 'You',
  defaultAvatarUrl 
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(24);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !imageFile && !videoFile && !showPoll) return;
    
    setIsSubmitting(true);
    
    try {
      const tweetData: any = {
        author: defaultAuthor,
        content: content.trim(),
        avatarUrl: defaultAvatarUrl
      };

      if (imageFile) {
        // In a real app, you'd upload to a service like AWS S3
        tweetData.imageUrl = imagePreview;
      }

      if (videoFile) {
        // In a real app, you'd upload to a service like AWS S3
        tweetData.videoUrl = videoPreview;
      }

      if (showPoll && pollQuestion.trim() && pollOptions.some(opt => opt.trim())) {
        tweetData.poll = {
          question: pollQuestion.trim(),
          options: pollOptions.filter(opt => opt.trim()),
          duration: pollDuration
        };
      }

      await onTweet(tweetData);
      
      // Reset form
      setContent('');
      setImageFile(null);
      setVideoFile(null);
      setImagePreview(null);
      setVideoPreview(null);
      setShowPoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);
      setPollDuration(24);
    } catch (error) {
      console.error('Failed to post tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setVideoFile(null); // Clear video if image selected
      setVideoPreview(null);
      
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setImageFile(null); // Clear image if video selected
      setImagePreview(null);
      
      const reader = new FileReader();
      reader.onload = () => setVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
    setVideoPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const isDisabled = (!content.trim() && !imageFile && !videoFile && !showPoll) || isSubmitting;
  const remainingChars = 280 - content.length;

  return (
    <div className={styles.composer}>
      <div className={styles.avatar}>
        {defaultAvatarUrl ? (
          <img src={defaultAvatarUrl} alt={`${defaultAuthor} avatar`} />
        ) : (
          <div className={styles.defaultAvatar}>
            {defaultAuthor.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          rows={3}
          disabled={isSubmitting}
        />

        {/* Media Preview */}
        {imagePreview && (
          <div className={styles.mediaPreview}>
            <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
            <button type="button" onClick={removeMedia} className={styles.removeMedia}>×</button>
          </div>
        )}

        {videoPreview && (
          <div className={styles.mediaPreview}>
            <video src={videoPreview} controls className={styles.videoPreview} />
            <button type="button" onClick={removeMedia} className={styles.removeMedia}>×</button>
          </div>
        )}

        {/* Poll Creator */}
        {showPoll && (
          <div className={styles.pollCreator}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className={styles.pollQuestion}
              maxLength={280}
            />
            {pollOptions.map((option, index) => (
              <div key={index} className={styles.pollOption}>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updatePollOption(index, e.target.value)}
                  className={styles.pollOptionInput}
                  maxLength={100}
                />
                {pollOptions.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => removePollOption(index)}
                    className={styles.removePollOption}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button type="button" onClick={addPollOption} className={styles.addPollOption}>
                + Add option
              </button>
            )}
            <div className={styles.pollDuration}>
              <label>Duration: </label>
              <select 
                value={pollDuration} 
                onChange={(e) => setPollDuration(Number(e.target.value))}
                className={styles.pollDurationSelect}
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={24}>1 day</option>
                <option value={72}>3 days</option>
                <option value={168}>1 week</option>
              </select>
            </div>
          </div>
        )}
        
        <div className={styles.footer}>
          <div className={styles.actions}>
            {/* Media Buttons */}
            <div className={styles.mediaButtons}>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                style={{ display: 'none' }}
              />
              
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className={styles.mediaButton}
                disabled={isSubmitting || videoFile !== null}
                title="Add photo"
              >
                📷
              </button>
              
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className={styles.mediaButton}
                disabled={isSubmitting || imageFile !== null}
                title="Add video"
              >
                🎥
              </button>
              
              <button
                type="button"
                onClick={() => setShowPoll(!showPoll)}
                className={`${styles.mediaButton} ${showPoll ? styles.active : ''}`}
                disabled={isSubmitting}
                title="Add poll"
              >
                📊
              </button>
            </div>

            <div className={styles.submitSection}>
              <span className={`${styles.charCount} ${remainingChars < 20 ? styles.warning : ''}`}>
                {remainingChars}
              </span>
              
              <button
                type="submit"
                className={styles.tweetButton}
                disabled={isDisabled}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
