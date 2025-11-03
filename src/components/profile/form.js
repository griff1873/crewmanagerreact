import { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa'; // Add save icon import
import { CreateProfileSchema } from '../../schema/profileschema';

export const ProfileForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading,
  user 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loginId: ''
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when initialData or user changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        loginId: initialData.loginId || user?.sub || ''
      });
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        loginId: user.sub || ''
      });
    }
  }, [initialData, user]);

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
      const validatedData = CreateProfileSchema.parse(formData);
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
    const form = document.querySelector('.profile-form form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="profile-form-layout">
        {/* Profile picture - same position as view */}
        {user?.picture && (
          <img 
            src={user.picture} 
            alt={user.name || 'Profile'} 
            className="profile-picture" 
          />
        )}

        {/* Form fields - structured like profile-info */}
        <div className="profile-form-fields">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Not provided"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={errors.address ? 'error' : ''}
              rows={2}
              placeholder="Not provided"
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="loginId">Login ID</label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleInputChange}
              className={errors.loginId ? 'error' : ''}
              readOnly
            />
            {errors.loginId && <span className="error-text">{errors.loginId}</span>}
            <small className="help-text">Automatically set from authentication</small>
          </div>
        </div>

        {/* Add save and cancel icons */}
        <div className="profile-actions">
          <FaSave 
            size={20}
            role="button"
            tabIndex={0}
            onClick={handleSaveClick}
            title={isLoading ? 'Saving...' : 'Save profile'}
            className={`action-icon save-icon ${isLoading ? 'disabled' : ''}`}
          />
          {onCancel && (
            <FaTimes 
              size={20}
              role="button"
              tabIndex={0}
              onClick={onCancel}
              title="Cancel editing"
              className="action-icon cancel-icon"
            />
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Profile' : 'Create Profile')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};