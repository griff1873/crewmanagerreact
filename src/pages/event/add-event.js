import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import AddEvent from "../components/events/add-event"
import {FaTrashAlt, FaCalendarPlus, FaPenSquare, FaUserPlus, FaUserMinus} from "react-icons/fa"
import { PageLayout } from "../components/page-layout";
import { EventSchema } from "../schema/eventschema";

const Content = ({ items, handleUserAdd, handleUserRemove, handleEdit, handleDelete, loading, error }) => {
  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events: {error}</div>;

  return (
    <div>
        <ul>
            {items.map((item) => (
                <li className="item" key={item.id}>
                <label>{item.name || item.title}</label>
                <label>{new Date(item.startDate || item.date).toLocaleDateString()}</label>
                <div>
                    <FaUserPlus 
                        size={24}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleUserAdd(item.id)}
                    />
                    <FaUserMinus
                        size={24}
                        role="button"
                        tabIndex={1}
                        onClick={() => handleUserRemove(item.id)}
                    />
                    <FaPenSquare 
                        size={24}
                        role="button"
                        tabIndex={2}
                        onClick={() => handleEdit(item.id)}
                    />
                    <FaTrashAlt
                        size={24}
                        role="button"
                        tabIndex={3}
                        onClick={() => handleDelete(item.id)}
                    />
                </div>
                </li>
            ))}
        </ul>
    </div>
  );
};

export const EventsPage = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize with today's date
  const today = new Date().toISOString().split('T')[0];
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    date: today, 
    time: "", 
    description: "" 
  });

  // Helper function to get authenticated headers
  const getAuthHeaders = async () => {
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

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      // Don't fetch if user is not authenticated
      if (!isAuthenticated || authLoading) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const headers = await getAuthHeaders();
        const response = await fetch('http://localhost:5262/api/Events', {
          headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate each event against the schema
        const validatedEvents = [];
        const validationErrors = [];
        
        data.forEach((event, index) => {
          try {
            const validatedEvent = EventSchema.parse(event);
            validatedEvents.push(validatedEvent);
          } catch (validationError) {
            console.warn(`Event ${index} failed validation:`, validationError.errors);
            validationErrors.push({
              event,
              errors: validationError.errors
            });
            // Optionally include invalid events with a flag
            validatedEvents.push({
              ...event,
              isValid: false,
              validationErrors: validationError.errors
            });
          }
        });
        
        if (validationErrors.length > 0) {
          console.warn('Some events failed validation:', validationErrors);
        }
        
        setItems(validatedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        setItems([
          { id: 1, title: "Event 1", date: "2024-07-01" },
          { id: 2, title: "Event 2", date: "2024-07-05" },
          { id: 3, title: "Event 3", date: "2024-07-10" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, authLoading, getAccessTokenSilently]);

  const handleUserAdd = (id) => {
      alert(`Add user to ${id}`);
  };      
  const handleUserRemove = (id) => {
      alert(`Remove user from ${id}`);
  };      
  const handleEdit = (id) => {
      alert(`Edit ${id}`);
  };      
  const handleDelete = async (id) => {
      if (!isAuthenticated) {
        alert('Please log in to delete events');
        return;
      }

      // Store original items before any changes
      const originalItems = [...items];

      try {
               
        // Optimistically update UI
        setItems(items.filter(item => item.id !== id));
        
        const headers = await getAuthHeaders();
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Events/${id}`, {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
      } catch (err) {
        console.error('Error deleting event:', err);
        // Revert the optimistic update on error
        setItems(originalItems);
        setError(err.message);
      }
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!isAuthenticated) {
        alert('Please log in to add events');
        return;
      }
      
      try {
        if (newEvent.title && newEvent.date && newEvent.time) {
          const eventToAdd = { 
            name: newEvent.title, 
            startDate: `${newEvent.date}T${newEvent.time}:00`,
            endDate: `${newEvent.date}T${newEvent.time}:00`, // You may want to add end time input
            location: "TBD", // You may want to add location input
            description: newEvent.description,
            minCrew: 1,
            maxCrew: 10,
            desiredCrew: 5
          };
          
          const headers = await getAuthHeaders();
          const response = await fetch('http://localhost:5262/api/Events', {
            method: 'POST',
            headers,
            body: JSON.stringify(eventToAdd)
          });
          
          if (!response.ok) {
            throw new Error('Failed to create event');
          }
          
          const createdEvent = await response.json();
          setItems([...items, createdEvent]);
          setNewEvent({ title: "", date: today, time: "", description: "" });
        }
      } catch (err) {
        console.error('Error adding event:', err);
        setError(err.message);
      }
  };

  // Show loading if Auth0 is still loading
  if (authLoading) {
    return (
      <PageLayout>
        <div>Loading authentication...</div>
      </PageLayout>
    );
  }

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div>Please log in to view and manage events.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
        <div>
            <AddEvent
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              handleSubmit={handleSubmit}
            />
            <Content 
              items={items}
              handleUserAdd={handleUserAdd}
              handleUserRemove={handleUserRemove}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              loading={loading}
              error={error}
            />
        </div>
    </PageLayout>
  );
}