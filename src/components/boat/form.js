import { useState } from 'react';
import { BoatFormSchema } from '../../schema/boatschema';

export const BoatForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    profileId: initialData?.profileId || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'profileId' ? parseInt(value) || '' : value
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
      const validatedData = BoatFormSchema.parse(formData);
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

  return (
    <form onSubmit={handleSubmit} className="boat-form">
      <div className="form-group">
        <label htmlFor="name">Boat Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          maxLength={200}
          required
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          rows={4}
          maxLength={1000}
          placeholder="Optional boat description..."
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
        <small className="char-count">
          {formData.description.length}/1000 characters
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="profileId">Profile ID *</label>
        <input
          type="number"
          id="profileId"
          name="profileId"
          value={formData.profileId}
          onChange={handleChange}
          className={errors.profileId ? 'error' : ''}
          min={1}
          required
        />
        {errors.profileId && <span className="error-text">{errors.profileId}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Boat' : 'Create Boat')}
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