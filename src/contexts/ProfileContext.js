import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useProfileService } from '../services/profile-service';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const profileService = useProfileService(); // Get the whole service object
  
  const [profile, setProfile] = useState(null);
  const [loginId, setLoginId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Create a stable function that doesn't change on every render
  const loadProfile = useCallback(async () => {
    if (!isAuthenticated || authLoading || !user?.email || hasChecked) {
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);
      
      console.log('Loading profile for email:', user.email);
      const userProfile = await profileService.getProfileByEmail(user.email);
      
      if (userProfile) {
        console.log('Profile loaded:', userProfile);
        setProfile(userProfile);
        setLoginId(userProfile.loginId || user.sub);
      } else {
        console.log('No profile found');
        setProfile(null);
        setLoginId(user.sub); // Use Auth0 user ID as fallback
      }
      
      setHasChecked(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileError(error.message);
      
      // Set loginId from Auth0 even if profile loading fails
      if (user?.sub) {
        setLoginId(user.sub);
      }
      
      setHasChecked(true);
    } finally {
      setProfileLoading(false);
    }
  }, [isAuthenticated, authLoading, user?.email, user?.sub, hasChecked, profileService.getProfileByEmail]);

  // Load profile when dependencies change
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Reset when user changes
  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setLoginId(null);
      setProfileError(null);
      setHasChecked(false);
    }
  }, [isAuthenticated, user?.email]);

  // Function to update profile after creation/update
  const updateProfile = useCallback((newProfile) => {
    console.log('Updating profile in context:', newProfile);
    setProfile(newProfile);
    setLoginId(newProfile.loginId || user?.sub);
  }, [user?.sub]);

  // Function to clear profile
  const clearProfile = useCallback(() => {
    setProfile(null);
    setLoginId(null);
    setProfileError(null);
    setHasChecked(false);
  }, []);

  const value = {
    profile,
    loginId,
    profileLoading,
    profileError,
    hasProfile: !!profile,
    hasChecked,
    updateProfile,
    clearProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};