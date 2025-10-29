import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

// Custom hook for authenticated API calls
export const useAuth0Api = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getAuthHeaders = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:events write:events delete:events"
        }
      });
      
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  // Generic authenticated fetch function
  const authenticatedFetch = useCallback(async (url, options = {}) => {
    const headers = await getAuthHeaders();
    
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });
  }, [getAuthHeaders]);

  // Convenience methods for common HTTP methods
  const get = useCallback((url, options = {}) => {
    return authenticatedFetch(url, {
      method: 'GET',
      ...options
    });
  }, [authenticatedFetch]);

  const post = useCallback((url, data, options = {}) => {
    return authenticatedFetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }, [authenticatedFetch]);

  const put = useCallback((url, data, options = {}) => {
    return authenticatedFetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }, [authenticatedFetch]);

  const del = useCallback((url, options = {}) => {
    return authenticatedFetch(url, {
      method: 'DELETE',
      ...options
    });
  }, [authenticatedFetch]);

  return {
    getAuthHeaders,
    authenticatedFetch,
    get,
    post,
    put,
    delete: del,
    isAuthenticated
  };
};

// Standalone function for non-hook contexts (if needed)
export const getAuthHeadersStandalone = async (getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "read:events write:events delete:events"
      }
    });
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};