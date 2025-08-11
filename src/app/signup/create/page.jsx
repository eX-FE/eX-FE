"use client";

import { useState } from "react";
import '../../login/login.css';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';

export default function CreateAccountPage() {
  const router = useRouter();
  const { register, isLoading } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData);
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Create your account</h1>
          <p className="login-subtitle">Join eX to start posting.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="What should we call you?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Choose a unique username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Create a strong password"
              required
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Create account'}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-text">
            Already have an account?
            <a href="/login" className="signup-link"> Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
} 