import { useState } from 'react';
import { FaTrashAlt, FaPenSquare, FaPlus } from 'react-icons/fa';
import { GiSailboat } from 'react-icons/gi';
import { useBoatService } from '../../services/boat-service';
import { BoatForm } from './form'; // Import the boat form

const BoatItem = ({ boat, onEdit, onDelete }) => (
  <li className="boat-item">
    <div className="boat-info">
      <div className="boat-header">
        {boat.image ? (
          <img
            src={boat.image}
            alt={boat.name}
            className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <GiSailboat className="boat-icon" style={{ display: boat.image ? 'none' : 'block' }} />
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

export const BoatsList = ({ boats = [], onBoatsChange, profileId }) => {
  const { deleteBoat, createBoat, isAuthenticated } = useBoatService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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

      const updatedBoats = boats.filter(boat => boat.id !== boatId);
      onBoatsChange(updatedBoats);

      await deleteBoat(boatId);

    } catch (err) {
      console.error('Error deleting boat:', err);
      onBoatsChange(originalBoats);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoat = () => {
    setShowAddForm(true); // Show the form instead of alert
    setError(null);
  };

  const handleFormSubmit = async (boatData) => {
    try {
      setFormLoading(true);
      setError(null);

      // Add profileId to the boat data
      const boatWithProfile = {
        ...boatData,
        profileId: profileId
      };

      console.log('Creating boat:', boatWithProfile);
      const newBoat = await createBoat(boatWithProfile);

      // Add the new boat to the list
      const updatedBoats = [...boats, newBoat];
      onBoatsChange(updatedBoats);

      // Hide the form
      setShowAddForm(false);

    } catch (err) {
      console.error('Error creating boat:', err);
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setError(null);
  };

  return (
    <div className="boats-section">
      <div className="boats-header">
        <h3>My Boats</h3>
        {/* Only show the Add Boat button when form is NOT shown */}
        {!showAddForm && (
          <button onClick={handleAddBoat} className="add-boat-btn" title="Add Boat">
            <FaPlus />
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="boats-loading">Updating boats...</div>
      )}

      {/* Show add boat form when showAddForm is true */}
      {showAddForm && (
        <div className="add-boat-form">
          <BoatForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={formLoading}
          />
        </div>
      )}

      {boats.length === 0 && !showAddForm ? (
        <div className="no-boats">
          <GiSailboat size={48} className="no-boats-icon" />
          <p>No boats registered yet.</p>
          <button onClick={handleAddBoat} className="add-first-boat-btn">
            Add Your First Boat
          </button>
        </div>
      ) : (
        !showAddForm && (
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
        )
      )}
    </div>
  );
};