import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import { ProfileForm } from "../components/profile/form";
import { ProfileView } from "../components/profile/view";
import { BoatsList } from "../components/boat/list";
import { useProfileService } from "../services/profile-service";
import { useProfile } from "../contexts/ProfileContext";

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const { createProfile, updateProfile: updateProfileApi } = useProfileService();
  const { profile, loginId, updateProfile: updateProfileContext, profileLoading } = useProfile();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(!profile); // Edit mode if no profile
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (validatedData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

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

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleNavigateToEvents = () => {
    navigate('/events');
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
          <>
            <ProfileView
              profile={profile}
              user={user}
              loginId={loginId}
              onEdit={handleEdit}
              onNavigateToEvents={handleNavigateToEvents}
            />
            
            {/* Boats list is now directly in the profile page */}
            <BoatsList profileId={profile.id} />
          </>
        ) : (
          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            onCancel={profile ? handleCancel : null}
            isLoading={saving}
            user={user}
          />
        )}
      </div>
    </PageLayout>
  );
};
