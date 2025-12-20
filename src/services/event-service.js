import { useAuth0Api } from './auth0-api';
import { EventSchema, EventsResponseSchema } from '../schema/eventschema';

export const useEventService = () => {
  const { get, post, put, delete: del, isAuthenticated } = useAuth0Api();

  const getAllEvents = async () => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching all events...');

      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/events`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Events API error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw events API response:', data);

      // Validate the full response structure
      try {
        const validatedResponse = EventsResponseSchema.parse(data);
        console.log('Events response validation successful');

        // Validate each individual event
        const validatedEvents = [];
        const validationErrors = [];

        validatedResponse.events.forEach((event, index) => {
          try {
            const validatedEvent = EventSchema.parse(event);
            validatedEvents.push(validatedEvent);
          } catch (validationError) {
            console.warn(`Event ${index} failed individual validation:`, validationError.errors);
            validationErrors.push({
              event,
              errors: validationError.errors
            });

            // Still include the event for display with validation flag
            validatedEvents.push({
              ...event,
              isValid: false,
              validationErrors: validationError.errors
            });
          }
        });

        if (validationErrors.length > 0) {
          console.warn(`${validationErrors.length} events had validation issues:`, validationErrors);
        }

        return {
          events: validatedEvents,
          pagination: validatedResponse.pagination
        };

      } catch (responseValidationError) {
        console.error('Events response structure validation failed:', responseValidationError.errors);

        // Fallback: try to extract events array manually
        if (data.events && Array.isArray(data.events)) {
          return {
            events: data.events,
            pagination: data.pagination || null
          };
        } else {
          throw new Error('Invalid response structure');
        }
      }

    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

  const createEvent = async (eventData) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Creating event with data:', eventData);

      const response = await post(`${process.env.REACT_APP_API_BASE_URL}/events`, eventData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create event error:', response.status, errorText);
        throw new Error(`Failed to create event: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Event created successfully:', data);

      // Validate the created event
      try {
        return EventSchema.parse(data);
      } catch (validationError) {
        console.warn('Created event failed validation:', validationError.errors);
        return { ...data, isValid: false, validationErrors: validationError.errors };
      }

    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (id, eventData) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Updating event ID:', id, 'with data:', eventData);

      const response = await put(`${process.env.REACT_APP_API_BASE_URL}/events/${id}`, eventData);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update event error:', response.status, errorText);
        throw new Error(`Failed to update event: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Event updated successfully:', data);

      return EventSchema.parse(data);

    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Deleting event ID:', id);

      const response = await del(`${process.env.REACT_APP_API_BASE_URL}/events/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete event error:', response.status, errorText);
        throw new Error(`Failed to delete event: ${response.status} - ${errorText}`);
      }

      console.log('Event deleted successfully');
      return true;

    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const getEventById = async (id) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching event ID:', id);

      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/events/${id}`);

      if (response.status === 404) {
        console.log('Event not found:', id);
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get event error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Event data received:', data);

      return EventSchema.parse(data);

    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  };

  const getEventsByProfileId = async (profileId) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching events for profile ID:', profileId);

      const response = await get(`${process.env.REACT_APP_API_BASE_URL}/events/${profileId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get profile events error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile events data received:', data);

      // We expect a list of events here.
      // Assuming the API returns a list directly or wrapped in { events: [...] }
      // Based on previous patterns, let's look for an array.

      let eventList = [];
      if (Array.isArray(data)) {
        eventList = data;
      } else if (data.events && Array.isArray(data.events)) {
        eventList = data.events;
      } else {
        // Fallback for single object or weird structure, try strict schema parsing?
        // Or if the user meant /events/{id} returns ONE item?
        // User said "get list of upcoming events", so we expect a list.
        console.warn('Unexpected data structure for profile events, defaulting to empty list or attempting parse');
        // If it's a single object that looks like an event, wrap it? Use caution.
      }

      // Parse each event mostly for safety, or just return them
      const validatedEvents = eventList.map(e => {
        try {
          return EventSchema.parse(e);
        } catch (err) {
          console.warn('Event validation error:', err);
          return { ...e, isValid: false }; // enhanced object
        }
      });

      return validatedEvents;

    } catch (error) {
      console.error('Error fetching events by profile ID:', error);
      throw error;
    }
  };

  const getUpcomingEvents = async (boatIds) => {
    if (!isAuthenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      console.log('Fetching upcoming events for boat IDs:', boatIds);

      // POST to /events/upcoming with boatIds in body assuming it's a POST request
      // If it were a GET, we'd need query params, but list of IDs usually implies POST for body or complex query string.
      // User said "passing in the list of boat ids", defaulting to POST for safety with lists.
      const response = await post(`${process.env.REACT_APP_API_BASE_URL}/events/upcoming`, { boatIds });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get upcoming events error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Upcoming events data received:', data);

      let eventList = [];
      if (Array.isArray(data)) {
        eventList = data;
      } else if (data.events && Array.isArray(data.events)) {
        eventList = data.events;
      } else {
        console.warn('Unexpected data structure for upcoming events, defaulting to empty list or attempting parse');
      }

      const validatedEvents = eventList.map(e => {
        try {
          return EventSchema.parse(e);
        } catch (err) {
          console.warn('Event validation error:', err);
          return { ...e, isValid: false };
        }
      });

      return validatedEvents;

    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  };

  return {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByProfileId,
    getUpcomingEvents,
    isAuthenticated
  };
};