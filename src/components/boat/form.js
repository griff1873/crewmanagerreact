import { useState, useEffect, useRef } from 'react';
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
      console.log('Validating form data:', formData);
      const FormSchema = CreateBoatSchema.omit({ profileId: true });
      const validatedData = FormSchema.parse(formData);
      console.log('Validation successful, calling onSubmit with:', validatedData);
      setErrors({});
      onSubmit(validatedData);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const formRef = useRef(null);

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const isNewBoat = !initialData;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('boat-image-input').click();
  };

  return (
    <div className="boat-form-container bg-white rounded-lg shadow-md p-6 w-full mx-auto border border-gray-100 mt-8">
      <form ref={formRef} onSubmit={handleSubmit} className="boat-form">
        <div className="boat-form-layout">
          {/* Add boat form header with icon and title */}
          <div className="boat-form-header">
            <div className="boat-form-title flex flex-col items-center justify-center w-full mb-6">
              <div
                onClick={triggerFileInput}
                className="cursor-pointer hover:opacity-80 transition-opacity relative group"
                title="Click to upload boat image"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Boat Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-skipper-primary shadow-sm mb-2"
                  />
                ) : (
                  <GiSailboat className="boat-icon text-skipper-primary mb-2" size={72} />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 rounded-full transition-opacity">
                  <span className="text-xs bg-black text-white px-2 py-1 rounded">Upload</span>
                </div>
              </div>
              <input
                type="file"
                id="boat-image-input"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <h4 className="text-2xl font-bold">{isNewBoat ? 'Add New Boat' : 'Edit Boat'}</h4>
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
                className={`${errors.name ? 'error' : ''} text-black`}
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
                className={`${errors.description ? 'error' : ''} text-black`}
                rows={3}
                placeholder="Enter boat description (optional)"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form >
    </div >
  );
};