import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useProfileService } from '../services/profile-service';

export const useProfileCheck = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const { getProfileByEmail } = useProfileService();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Use ref to track if we've already made the API call
  const hasAttemptedCheck = useRef(false);

  useEffect(() => {
    const checkProfile = async () => {
      // Don't run if already checked, not authenticated, or missing email
      if (hasAttemptedCheck.current || !isAuthenticated || authLoading || !user?.email) {
        return;
      }

      // Mark that we've attempted the check
      hasAttemptedCheck.current = true;

      try {
        setProfileLoading(true);
        setProfileError(null);

        console.log('Checking profile for email:', user.email);
        const userProfile = await getProfileByEmail(user.email);

        if (userProfile) {
          console.log('Profile found:', userProfile);
          setProfile(userProfile);
          // Store profile ID for easy access throughout the app
          if (userProfile.id) {
            localStorage.setItem('user_profile_id', userProfile.id);
            console.log('Stored profile ID in localStorage:', userProfile.id);
          }
        } else {
          console.log('No profile found, redirecting to profile page');
          navigate('/profile');
        }

        setHasChecked(true);
      } catch (error) {
        console.error('Error checking profile:', error);
        setProfileError(error.message);

        // Only redirect on 404 errors, not on 500 errors
        if (error.message.includes('404') || error.message.includes('not found')) {
          console.log('Profile not found (404), redirecting to profile page');
          navigate('/profile');
        } else if (error.message.includes('500')) {
          console.error('Server error (500) - not redirecting to avoid infinite loop');
          // Don't redirect on server errors, just log the error
        } else {
          console.log('Other error, redirecting to profile page');
          navigate('/profile');
        }

        setHasChecked(true);
      } finally {
        setProfileLoading(false);
      }
    };

    checkProfile();
  }, [isAuthenticated, authLoading, user?.email]); // Removed getProfileByEmail and navigate from dependencies

  // Reset the check when user changes
  useEffect(() => {
    hasAttemptedCheck.current = false;
    setHasChecked(false);
    setProfile(null);
    setProfileError(null);
  }, [user?.email]);

  return {
    profile,
    profileLoading,
    profileError,
    hasProfile: !!profile,
    hasChecked
  };
};