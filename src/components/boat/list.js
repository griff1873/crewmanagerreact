import { useState, useEffect } from 'react';
import { FaTrashAlt, FaPenSquare, FaPlus } from 'react-icons/fa';
import { GiSailboat } from 'react-icons/gi'; // Import sailboat from Game Icons
import { useBoatService } from '../../services/boat-service';

const BoatItem = ({ boat, onEdit, onDelete }) => (
  <li className="boat-item">
    <div className="boat-info">
      <div className="boat-header">
        <GiSailboat className="boat-icon" /> {/* Changed from FaShip to GiSailboat */}
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

export const BoatsList = ({ boats = [], onBoatsChange }) => {
  const { deleteBoat, isAuthenticated } = useBoatService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setLoading(true);
      setError(null);
      
      // Optimistically update UI
      const updatedBoats = boats.filter(boat => boat.id !== boatId);
      onBoatsChange(updatedBoats);
      
      await deleteBoat(boatId);
      
    } catch (err) {
      console.error('Error deleting boat:', err);
      // Revert optimistic update
      onBoatsChange(originalBoats);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoat = () => {
    alert(`Add new boat`);
    // TODO: Navigate to add boat page or open modal
  };

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
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="boats-loading">Updating boats...</div>
      )}

      {boats.length === 0 ? (
        <div className="no-boats">
          <GiSailboat size={48} className="no-boats-icon" /> {/* Changed from FaShip to GiSailboat */}
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