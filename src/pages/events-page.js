import { useState, useEffect, useCallback } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import AddEvent from "../components/events/add-event"
import {FaTrashAlt, FaCalendarPlus, FaPenSquare, FaUserPlus, FaUserMinus} from "react-icons/fa"
import { PageLayout } from "../components/page-layout";
import { useEventService } from "../services/event-service";
import { useProfile } from "../contexts/ProfileContext";

const Content = ({ items, handleUserAdd, handleUserRemove, handleEdit, handleDelete, loading, error, pagination }) => {
  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events: {error}</div>;

  return (
    <div>
        {pagination && (
          <div className="pagination-info">
            <p>Showing {items.length} of {pagination.totalCount} events (Page {pagination.page} of {pagination.totalPages})</p>
          </div>
        )}
        <ul>
            {items.map((item) => (
                <li className="item" key={item.id}>
                <label>{item.name}</label>
                <label>{new Date(item.startDate).toLocaleDateString()}</label>
                <label>{item.location}</label>
                <label>{item.minCrew}-{item.desiredCrew}-{item.maxCrew} crew</label>
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
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { getAllEvents, createEvent, deleteEvent, isAuthenticated: serviceIsAuthenticated } = useEventService();
  const { profile, loginId, hasProfile } = useProfile(); // Access profile context
  
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    date: today, 
    time: "", 
    description: "" 
  });

  // Show profile info for debugging
  useEffect(() => {
    if (loginId) {
      console.log('Events page - Current loginId:', loginId);
      console.log('Events page - Has profile:', hasProfile);
      console.log('Events page - Profile:', profile);
    }
  }, [loginId, hasProfile, profile]);

  // Memoize the fetch function to prevent infinite loops
  const fetchEvents = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!isAuthenticated || authLoading) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getAllEvents();
      
      setItems(result.events);
      setPagination(result.pagination);
      
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      setItems([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, getAllEvents]);

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleUserAdd = (id) => {
      alert(`Add user to event ${id}`);
  };      
  const handleUserRemove = (id) => {
      alert(`Remove user from event ${id}`);
  };      
  const handleEdit = (id) => {
      alert(`Edit event ${id}`);
  };      
  
  const handleDelete = async (id) => {
      if (!serviceIsAuthenticated) {
        alert('Please log in to delete events');
        return;
      }

      const originalItems = [...items];
      const originalPagination = pagination;

      try {
        // Optimistically update UI
        setItems(items.filter(item => item.id !== id));
        
        await deleteEvent(id);
        
        // Update pagination count
        if (pagination) {
          setPagination({
            ...pagination,
            totalCount: pagination.totalCount - 1
          });
        }
        
      } catch (err) {
        console.error('Error deleting event:', err);
        // Revert optimistic updates
        setItems(originalItems);
        setPagination(originalPagination);
        setError(err.message);
      }
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!serviceIsAuthenticated) {
        alert('Please log in to add events');
        return;
      }
      
      try {
        if (newEvent.title && newEvent.date && newEvent.time) {
          const eventToAdd = { 
            name: newEvent.title, 
            startDate: `${newEvent.date}T${newEvent.time}:00.000Z`,
            endDate: `${newEvent.date}T${newEvent.time}:00.000Z`,
            location: "TBD",
            description: newEvent.description,
            minCrew: 1,
            maxCrew: 10,
            desiredCrew: 5,
            createdBy: loginId // Use loginId from context
          };
          
          const createdEvent = await createEvent(eventToAdd);
          
          setItems([...items, createdEvent]);
          setNewEvent({ title: "", date: today, time: "", description: "" });
          
          // Update pagination
          if (pagination) {
            setPagination({
              ...pagination,
              totalCount: pagination.totalCount + 1
            });
          }
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
              pagination={pagination}
            />
        </div>
    </PageLayout>
  );
}