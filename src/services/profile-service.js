import { useAuth0Api } from './auth0-api';
import { ProfileSchema } from '../schema/profileschema';

export const useProfileService = () => {
  const { get, post, put, delete: del, isAuthenticated } = useAuth0Api();

  const getProfileByEmail = async (email) => {
    // Check authentication before making the call
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Making authenticated request to get profile by email:', email);
      
      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/Profile/by-email/${encodeURIComponent(email)}`);
      
      console.log('Profile API response status:', response.status);
      
      if (response.status === 404) {
        console.log('No profile found for email:', email);
        return null; // No profile found
      }
      
      if (response.status === 500) {
        const errorText = await response.text();
        console.error('Server error (500):', errorText);
        throw new Error(`Server error (500): ${errorText}`);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile API error:', response.status, errorText);
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Profile data received:', data);
      
      // Validate the profile data
      try {
        const validatedProfile = ProfileSchema.parse(data);
        console.log('Profile validation successful');
        return validatedProfile;
      } catch (validationError) {
        console.warn('Profile validation failed:', validationError.errors);
        return data; // Return raw data if validation fails
      }
    } catch (error) {
      console.error('Error fetching profile by email:', error);
      throw error;
    }
  };

  const createProfile = async (profileData) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Creating profile with data:', profileData);
      
      const response = await post(`${process.env.REACT_APP_API_BASE_URL}/Profile`, profileData);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create profile error:', response.status, errorText);
        throw new Error(`Failed to create profile: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Profile created successfully:', data);
      
      return ProfileSchema.parse(data);
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (id, profileData) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Updating profile ID:', id, 'with data:', profileData);
      
      const response = await put(`${process.env.REACT_APP_API_BASE_URL}/Profile/${id}`, profileData);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update profile error:', response.status, errorText);
        throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Profile updated successfully:', data);
      
      return ProfileSchema.parse(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    getProfileByEmail,
    createProfile,
    updateProfile,
    isAuthenticated
  };
};