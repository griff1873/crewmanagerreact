import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus } from 'react-icons/fa';
import { GiSailboat } from 'react-icons/gi';
import { CreateBoatSchema } from '../../schema/boatschema';

export const BoatForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    profileId: initialData?.profileId || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        profileId: initialData.profileId || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = CreateBoatSchema.parse(formData);
      setErrors({});
      onSubmit(validatedData);
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleSaveClick = () => {
    // Trigger form submission when save icon is clicked
    const form = document.querySelector('.boat-form form');
    if (form) {
      form.requestSubmit();
    }
  };

  const isNewBoat = !initialData;

  return (
    <div className="boat-form-container">       
      <form onSubmit={handleSubmit} className="boat-form">
        <div className="boat-form-layout">
          {/* Add boat form header with icon and title */}
          <div className="boat-form-header">
            <div className="boat-form-title">
             
              <h4>{isNewBoat ? 'Add New Boat' : 'Edit Boat'}</h4>
            </div>
            
            <div className="boat-form-actions">
              <FaSave 
                size={20}
                role="button"
                tabIndex={0}
                onClick={handleSaveClick}
                title={isLoading ? 'Saving...' : 'Save boat'}
                className={`action-icon save-icon ${isLoading ? 'disabled' : ''}`}
              />
              {onCancel && (
                <FaTimes 
                  size={20}
                  role="button"
                  tabIndex={0}
                  onClick={onCancel}
                  title="Cancel"
                  className="action-icon cancel-icon"
                />
              )}
            </div>
          </div>

          <div className="boat-form-fields">
            <div className="form-group">
              <label htmlFor="name">Boat Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                required
                placeholder="Enter boat name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                rows={3}
                placeholder="Enter boat description (optional)"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};