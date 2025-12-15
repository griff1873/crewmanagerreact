import { useAuth0Api } from './auth0-api';
import { BoatSchema, BoatsResponseSchema } from '../schema/boatschema';

export const useBoatService = () => {
  const { get, post, put, delete: del, isAuthenticated } = useAuth0Api();

  const getAllBoats = async (page = 1, pageSize = 50) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching all boats...');

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/boats?${queryParams}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Boats API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw boats API response:', data);

      // Validate the full response structure
      try {
        const validatedResponse = BoatsResponseSchema.parse(data);
        console.log('Boats response validation successful');

        return {
          boats: validatedResponse.boats,
          pagination: validatedResponse.pagination
        };

      } catch (responseValidationError) {
        console.error('Boats response structure validation failed:', responseValidationError.errors);

        // Fallback: try to extract boats array manually
        if (data.boats && Array.isArray(data.boats)) {
          return {
            boats: data.boats,
            pagination: data.pagination || null
          };
        } else if (Array.isArray(data)) {
          // If response is just an array of boats
          return {
            boats: data,
            pagination: null
          };
        } else {
          throw new Error('Invalid response structure');
        }
      }

    } catch (error) {
      console.error('Error fetching boats:', error);
      throw error;
    }
  };

  const getBoatById = async (id) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching boat ID:', id);

      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/boats/${id}`);

      if (response.status === 404) {
        console.log('Boat not found:', id);
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get boat error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Boat data received:', data);

      return BoatSchema.parse(data);

    } catch (error) {
      console.error('Error fetching boat by ID:', error);
      throw error;
    }
  };

  const getBoatsByProfileId = async (profileId) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching boats for profile ID:', profileId);

      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/boats/by-profile/${profileId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get boats by profile error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile boats data received:', data);

      // Handle both array and object responses
      const boats = Array.isArray(data) ? data : data.boats || [];

      return boats.map(boat => {
        try {
          return BoatSchema.parse(boat);
        } catch (validationError) {
          console.warn('Profile boat validation failed:', validationError.errors);
          return { ...boat, isValid: false, validationErrors: validationError.errors };
        }
      });

    } catch (error) {
      console.error('Error fetching boats by profile ID:', error);
      throw error;
    }
  };

  const createBoat = async (boatData) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Creating boat with data:', boatData);

      const response = await post(`${process.env.REACT_APP_API_BASE_URL}/boats`, boatData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create boat error:', response.status, errorText);
        throw new Error(`Failed to create boat: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Boat created successfully:', data);

      return BoatSchema.parse(data);

    } catch (error) {
      console.error('Error creating boat:', error);
      throw error;
    }
  };

  const updateBoat = async (id, boatData) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Updating boat ID:', id, 'with data:', boatData);

      const response = await put(`${process.env.REACT_APP_API_BASE_URL}/boats/${id}`, boatData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update boat error:', response.status, errorText);
        throw new Error(`Failed to update boat: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Boat updated successfully:', data);

      return BoatSchema.parse(data);

    } catch (error) {
      console.error('Error updating boat:', error);
      throw error;
    }
  };

  const deleteBoat = async (id) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Deleting boat ID:', id);

      const response = await del(`${process.env.REACT_APP_API_BASE_URL}/boats/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete boat error:', response.status, errorText);
        throw new Error(`Failed to delete boat: ${response.status} - ${errorText}`);
      }

      console.log('Boat deleted successfully');
      return true;

    } catch (error) {
      console.error('Error deleting boat:', error);
      throw error;
    }
  };

  return {
    getAllBoats,
    getBoatById,
    getBoatsByProfileId,
    createBoat,
    updateBoat,
    deleteBoat,
    isAuthenticated
  };
};