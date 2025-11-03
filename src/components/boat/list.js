import { useState, useEffect } from 'react';
import { FaTrashAlt, FaPenSquare, FaPlus, FaShip } from 'react-icons/fa';
import { useBoatService } from '../../services/boat-service';

const BoatItem = ({ boat, onEdit, onDelete }) => (
  <li className="boat-item">
    <div className="boat-info">
      <div className="boat-header">
        <FaShip className="boat-icon" />
        <h4 className="boat-name">{boat.name}</h4>
      </div>
      {boat.description && (
        <p className="boat-description">{boat.description}</p>
      )}
      <div className="boat-meta">
        <small>Created: {new Date(boat.createdAt).toLocaleDateString()}</small>
        {boat.updatedAt !== boat.createdAt && (
          <small>Updated: {new Date(boat.updatedAt).toLocaleDateString()}</small>
        )}
      </div>
    </div>
    <div className="boat-actions">
      <FaPenSquare 
        size={20}
        role="button"
        tabIndex={0}
        onClick={() => onEdit(boat.id)}
        title="Edit boat"
        className="action-icon edit-icon"
      />
      <FaTrashAlt
        size={20}
        role="button"
        tabIndex={1}
        onClick={() => onDelete(boat.id)}
        title="Delete boat"
        className="action-icon delete-icon"
      />
    </div>
  </li>
);

export const BoatsList = ({ profileId }) => {
  const { getBoatsByProfileId, deleteBoat, isAuthenticated } = useBoatService();
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch boats for this profile
  useEffect(() => {
    const fetchBoats = async () => {
      if (!profileId || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching boats for profile ID:', profileId);
        const profileBoats = await getBoatsByProfileId(profileId);
        setBoats(profileBoats);
        
      } catch (err) {
        console.error('Error fetching profile boats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, [profileId, getBoatsByProfileId, isAuthenticated]);

  const handleEdit = (boatId) => {
    alert(`Edit boat ${boatId}`);
    // TODO: Navigate to edit boat page or open modal
  };

  const handleDelete = async (boatId) => {
    if (!window.confirm('Are you sure you want to delete this boat?')) {
      return;
    }

    const originalBoats = [...boats];

    try {
      // Optimistically update UI
      setBoats(boats.filter(boat => boat.id !== boatId));
      
      await deleteBoat(boatId);
      
    } catch (err) {
      console.error('Error deleting boat:', err);
      // Revert optimistic update
      setBoats(originalBoats);
      setError(err.message);
    }
  };

  const handleAddBoat = () => {
    alert(`Add boat for profile ${profileId}`);
    // TODO: Navigate to add boat page or open modal
  };

  if (loading) {
    return (
      <div className="boats-section">
        <div className="boats-header">
          <h3>My Boats</h3>
        </div>
        <div className="boats-loading">Loading boats...</div>
      </div>
    );
  }

  return (
    <div className="boats-section">
      <div className="boats-header">
        <h3>My Boats</h3>
        <button onClick={handleAddBoat} className="add-boat-btn">
          <FaPlus /> Add Boat
        </button>
      </div>

      {error && (
        <div className="error-message">
          Error loading boats: {error}
        </div>
      )}

      {boats.length === 0 ? (
        <div className="no-boats">
          <FaShip size={48} className="no-boats-icon" />
          <p>No boats registered yet.</p>
          <button onClick={handleAddBoat} className="add-first-boat-btn">
            Add Your First Boat
          </button>
        </div>
      ) : (
        <ul className="boats-list">
          {boats.map((boat) => (
            <BoatItem 
              key={boat.id} 
              boat={boat} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};