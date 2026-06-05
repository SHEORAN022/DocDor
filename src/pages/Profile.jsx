import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiMail, FiLock, FiSave, FiRefreshCw, 
  FiShield, FiClock, FiCheckCircle, FiAlertCircle,
  FiEdit2, FiCamera, FiSmartphone, FiMapPin, FiBriefcase
} from 'react-icons/fi';
import { FaUserShield, FaRegClock, FaRegCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const { admin, updateProfile } = useAuth();
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updateData = { name, email };
    if (password) updateData.password = password;
    
    const result = await updateProfile(updateData);
    setLoading(false);
    
    if (result?.success) {
      setUpdateSuccess(true);
      setPassword('');
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const getInitials = () => {
    return admin?.name?.charAt(0).toUpperCase() || 'A';
  };

  const getMemberSince = () => {
    const date = admin?.createdAt || admin?.memberSince || new Date();
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-subtitle">Manage your account information and preferences</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-grid">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-card user-card">
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <div className="avatar">
                    <span className="avatar-initials">{getInitials()}</span>
                  </div>
                  <button className="avatar-edit-btn">
                    <FiCamera size={14} />
                  </button>
                </div>
              </div>
              
              <div className="user-info">
                <h3 className="user-name">{admin?.name || 'Administrator'}</h3>
                <p className="user-email">{admin?.email || 'admin@example.com'}</p>
                <div className="user-badge">
                  <FaUserShield size={12} />
                  <span>{admin?.role || 'Administrator'}</span>
                </div>
              </div>
              
              <div className="user-stats">
                <div className="stat-item">
                  <FiClock className="stat-icon" />
                  <div>
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">{getMemberSince()}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiCheckCircle className="stat-icon" />
                  <div>
                    <span className="stat-label">Account Status</span>
                    <span className="stat-value verified">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card info-card">
              <h4 className="card-title">Account Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <FiShield className="info-icon" />
                  <div>
                    <span className="info-label">Security Level</span>
                    <span className="info-value">High</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiSmartphone className="info-icon" />
                  <div>
                    <span className="info-label">2FA Status</span>
                    <span className="info-value inactive">Not Enabled</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiBriefcase className="info-icon" />
                  <div>
                    <span className="info-label">Account Type</span>
                    <span className="info-value">Professional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="profile-main">
            {/* Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser size={16} />
                Profile Information
              </button>
              <button 
                className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FiLock size={16} />
                Security Settings
              </button>
            </div>

            {/* Profile Form */}
            {activeTab === 'profile' && (
              <div className="profile-card form-card">
                <div className="form-header">
                  <h3 className="form-title">Personal Information</h3>
                  <p className="form-description">Update your personal details and contact information</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label className="form-label">
                      <FiUser className="label-icon" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                    <span className="input-hint">This is your display name across the platform</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FiMail className="label-icon" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="Enter your email address"
                      required
                    />
                    <span className="input-hint">We'll send notifications to this email</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <FiBriefcase className="label-icon" />
                        Department
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Surgery, Cardiology"
                        value="Administration"
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <FiMapPin className="label-icon" />
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Your location"
                        value="Main Hospital"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      className="submit-btn"
                    >
                      {loading ? (
                        <>
                          <FiRefreshCw className="spinner" size={18} />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiSave size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                  {/* Success Message */}
                  {updateSuccess && (
                    <div className="success-message">
                      <FiCheckCircle size={18} />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="profile-card form-card">
                <div className="form-header">
                  <h3 className="form-title">Security Settings</h3>
                  <p className="form-description">Manage your password and security preferences</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label className="form-label">
                      <FiLock className="label-icon" />
                      New Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input password-input"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <span className="input-hint">Leave blank to keep current password</span>
                  </div>

                  <div className="password-requirements">
                    <p className="requirements-title">Password Requirements:</p>
                    <ul className="requirements-list">
                      <li>At least 8 characters long</li>
                      <li>Contains uppercase and lowercase letters</li>
                      <li>Contains at least one number</li>
                      <li>Contains at least one special character</li>
                    </ul>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={loading}
                      className="submit-btn"
                    >
                      {loading ? (
                        <>
                          <FiRefreshCw className="spinner" size={18} />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiSave size={18} />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>

                  {updateSuccess && (
                    <div className="success-message">
                      <FiCheckCircle size={18} />
                      <span>Security settings updated!</span>
                    </div>
                  )}
                </form>

                {/* Additional Security Info */}
                <div className="security-info">
                  <div className="security-item">
                    <div className="security-icon warning">
                      <FiAlertCircle size={20} />
                    </div>
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="enable-2fa-btn">Enable</button>
                  </div>
                  <div className="security-item">
                    <div className="security-icon success">
                      <FiCheckCircle size={20} />
                    </div>
                    <div>
                      <h4>Recent Activity</h4>
                      <p>View your recent login history</p>
                    </div>
                    <button className="view-activity-btn">View</button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Section */}
            <div className="profile-card activity-card">
              <h3 className="card-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <FiEdit2 size={14} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Profile information updated</p>
                    <span className="activity-time">Just now</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <FiLock size={14} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Password changed successfully</p>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <FiUser size={14} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Account login from Chrome on Windows</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9eef5 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 24px;
        }

        .profile-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Page Header */
        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 15px;
          color: #64748b;
        }

        /* Profile Grid */
        .profile-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 28px;
        }

        @media (max-width: 1024px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Profile Cards Common */
        .profile-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .profile-card:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        /* User Card */
        .user-card {
          text-align: center;
          padding: 32px 24px;
          margin-bottom: 24px;
        }

        .avatar-section {
          margin-bottom: 20px;
        }

        .avatar-wrapper {
          position: relative;
          display: inline-block;
        }

        .avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .avatar-initials {
          font-size: 42px;
          font-weight: 700;
          color: white;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 32px;
          height: 32px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          color: #3b82f6;
          transition: all 0.2s ease;
        }

        .avatar-edit-btn:hover {
          transform: scale(1.05);
          background: #f0f9ff;
        }

        .user-name {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .user-email {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 12px;
        }

        .user-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef2ff;
          padding: 6px 14px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 500;
          color: #3b82f6;
        }

        .user-stats {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: left;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .stat-item:last-child {
          margin-bottom: 0;
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          padding: 8px;
          background: #f1f5f9;
          border-radius: 12px;
          color: #64748b;
        }

        .stat-label {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 2px;
        }

        .stat-value {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
        }

        .stat-value.verified {
          color: #10b981;
        }

        /* Info Card */
        .info-card {
          padding: 24px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-icon {
          width: 36px;
          height: 36px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 10px;
          color: #3b82f6;
        }

        .info-label {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 2px;
        }

        .info-value {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
        }

        .info-value.inactive {
          color: #f59e0b;
        }

        /* Tabs */
        .profile-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          background: white;
          padding: 6px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: #f1f5f9;
          color: #1e293b;
        }

        /* Form Card */
        .form-card {
          margin-bottom: 24px;
        }

        .form-header {
          padding: 24px 28px 0;
        }

        .form-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .form-description {
          font-size: 13px;
          color: #64748b;
        }

        .profile-form {
          padding: 24px 28px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 8px;
        }

        .label-icon {
          color: #3b82f6;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input:disabled {
          background: #f8fafc;
          color: #94a3b8;
        }

        .input-hint {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 6px;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input {
          padding-right: 80px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .password-toggle:hover {
          background: #eef2ff;
        }

        .password-requirements {
          background: #f8fafc;
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .requirements-title {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .requirements-list {
          list-style: none;
          padding-left: 0;
        }

        .requirements-list li {
          font-size: 11px;
          color: #64748b;
          padding-left: 18px;
          position: relative;
          margin-bottom: 4px;
        }

        .requirements-list li::before {
          content: "•";
          position: absolute;
          left: 6px;
          color: #3b82f6;
        }

        .form-actions {
          margin-top: 28px;
        }

        .submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 28px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .success-message {
          margin-top: 20px;
          padding: 14px 18px;
          background: #ecfdf5;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #10b981;
          font-size: 14px;
          font-weight: 500;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Security Info */
        .security-info {
          border-top: 1px solid #e2e8f0;
          padding: 20px 28px;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .security-item:last-child {
          border-bottom: none;
        }

        .security-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .security-icon.warning {
          background: #fef3c7;
          color: #f59e0b;
        }

        .security-icon.success {
          background: #ecfdf5;
          color: #10b981;
        }

        .security-item h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .security-item p {
          font-size: 12px;
          color: #64748b;
        }

        .enable-2fa-btn, .view-activity-btn {
          margin-left: auto;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .enable-2fa-btn {
          background: #3b82f6;
          border: none;
          color: white;
        }

        .enable-2fa-btn:hover {
          background: #2563eb;
        }

        .view-activity-btn {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }

        .view-activity-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Activity Card */
        .activity-card {
          padding: 24px 28px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          font-size: 13px;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .activity-time {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-container {
            padding: 16px;
          }

          .page-title {
            font-size: 26px;
          }

          .profile-card {
            border-radius: 20px;
          }

          .form-header, .profile-form, .security-info {
            padding: 20px;
          }

          .tab-btn {
            padding: 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;