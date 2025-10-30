import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { useProfileService } from "../services/profile-service";
import { useProfile } from "../contexts/ProfileContext";
import { CreateProfileSchema } from "../schema/profileschema";

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { createProfile, updateProfile: updateProfileApi } = useProfileService();
  const { profile, loginId, updateProfile: updateProfileContext, profileLoading } = useProfile();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(!profile); // Edit mode if no profile
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loginId: ''
  });

  // Initialize form data when profile or user changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        loginId: profile.loginId || loginId || user?.sub || ''
      });
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        loginId: loginId || user.sub || ''
      });
    }
  }, [profile, user, loginId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validate form data
      const validatedData = CreateProfileSchema.parse(formData);

      let savedProfile;
      if (profile) {
        // Update existing profile
        savedProfile = await updateProfileApi(profile.id, validatedData);
        setSuccess('Profile updated successfully!');
      } else {
        // Create new profile
        savedProfile = await createProfile(validatedData);
        setSuccess('Profile created successfully!');
      }

      // Update the context with the new/updated profile
      updateProfileContext(savedProfile);
      
      setIsEditing(false);

      // Redirect to events page after successful creation/update
      setTimeout(() => {
        navigate('/events');
      }, 1500);

    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (profileLoading) {
    return (
      <PageLayout>
        <div>Loading profile...</div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div>Please log in to view your profile.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="profile-container">
        <h1>{profile ? 'My Profile' : 'Create Profile'}</h1>
        
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {!isEditing && profile ? (
          <div className="profile-view">
            <div className="profile-details">
              {user?.picture && (
                <img 
                  src={user.picture} 
                  alt={profile.name} 
                  className="profile-picture" 
                />
              )}
              <div className="profile-info">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
                <p><strong>Address:</strong> {profile.address || 'Not provided'}</p>
                <p><strong>Login ID:</strong> {loginId}</p>
              </div>
            </div>
            <div className="form-actions">
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              <button onClick={() => navigate('/events')}>Go to Events</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginId">Login ID</label>
              <input
                type="text"
                id="loginId"
                name="loginId"
                value={formData.loginId}
                onChange={handleInputChange}
                readOnly
                style={{ backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
              </button>
              {profile && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
};
