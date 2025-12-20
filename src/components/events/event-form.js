import React, { useState, useEffect } from 'react';
import { CreateEventSchema } from '../../schema/eventschema';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useBoatService } from '../../services/boat-service';
import format from 'date-fns/format';

export const EventForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [boats, setBoats] = useState([]);
    const { getBoatsByProfileId } = useBoatService();

    const [formData, setFormData] = useState({
        boatId: initialData?.boatId || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
        location: initialData?.location || '',
        minCrew: initialData?.minCrew ?? '',
        desiredCrew: initialData?.desiredCrew ?? '',
        maxCrew: initialData?.maxCrew ?? ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBoats = async () => {
            const profileId = localStorage.getItem('user_profile_id');
            if (profileId) {
                try {
                    const userBoats = await getBoatsByProfileId(profileId);
                    setBoats(userBoats);
                } catch (error) {
                    console.error('Failed to fetch boats:', error);
                }
            }
        };
        fetchBoats();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let processedValue = value;

        if (type === 'number') {
            // Allow empty string for nullable fields, otherwise parse int
            processedValue = value === '' ? '' : parseInt(value, 10);
        } else if (name === 'boatId') {
            processedValue = parseInt(value, 10);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        try {
            // Prepare data for validation
            const dataToValidate = {
                ...formData,
                boatId: Number(formData.boatId),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                minCrew: formData.minCrew === '' ? null : Number(formData.minCrew),
                desiredCrew: formData.desiredCrew === '' ? null : Number(formData.desiredCrew),
                maxCrew: formData.maxCrew === '' ? null : Number(formData.maxCrew),
            };

            const validationResult = CreateEventSchema.safeParse(dataToValidate);

            if (!validationResult.success) {
                const newErrors = {};
                validationResult.error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
                return false;
            }

            setErrors({});
            return true;
        } catch (error) {
            console.error("Validation error", error);
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const submissionData = {
                ...formData,
                boatId: Number(formData.boatId),
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                minCrew: formData.minCrew === '' ? null : Number(formData.minCrew),
                desiredCrew: formData.desiredCrew === '' ? null : Number(formData.desiredCrew),
                maxCrew: formData.maxCrew === '' ? null : Number(formData.maxCrew),
            };

            onSubmit(submissionData);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    {initialData ? 'Edit Event' : 'Create New Event'}
                </h2>

                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Cancel"
                    >
                        <FaTimes size={20} />
                    </button>
                    <button
                        form="event-form"
                        type="submit"
                        disabled={isLoading}
                        className="p-2 text-blue-600 hover:text-blue-700 transition-colors rounded-full hover:bg-blue-50"
                        title="Save Event"
                    >
                        <FaSave size={20} />
                    </button>
                </div>
            </div>

            <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Boat Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Boat <span className="text-red-500">*</span></label>
                    <select
                        name="boatId"
                        value={formData.boatId}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-black ${errors.boatId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">-- Select a Boat --</option>
                        {boats.map(boat => (
                            <option key={boat.id} value={boat.id}>
                                {boat.name}
                            </option>
                        ))}
                    </select>
                    {errors.boatId && <p className="mt-1 text-sm text-red-500">{errors.boatId}</p>}
                </div>

                {/* Event Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. Weekend Regatta"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Describe the event details..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Date Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time <span className="text-red-500">*</span></label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. Marina Bay, Dock 4"
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                </div>

                {/* Crew Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Crew</label>
                        <input
                            type="number"
                            name="minCrew"
                            value={formData.minCrew}
                            onChange={handleChange}
                            min="0"
                            placeholder="Optional"
                            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.minCrew ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.minCrew && <p className="mt-1 text-sm text-red-500">{errors.minCrew}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desired Crew</label>
                        <input
                            type="number"
                            name="desiredCrew"
                            value={formData.desiredCrew}
                            onChange={handleChange}
                            min="0"
                            placeholder="Optional"
                            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.desiredCrew ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.desiredCrew && <p className="mt-1 text-sm text-red-500">{errors.desiredCrew}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Crew</label>
                        <input
                            type="number"
                            name="maxCrew"
                            value={formData.maxCrew}
                            onChange={handleChange}
                            min="0"
                            placeholder="Optional"
                            className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black ${errors.maxCrew ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.maxCrew && <p className="mt-1 text-sm text-red-500">{errors.maxCrew}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
};
