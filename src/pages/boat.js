
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/page-layout';
import { BoatForm } from '../components/boat/form';
import { useBoatService } from '../services/boat-service';
import { PageLoader } from '../components/page-loader';

export const BoatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBoatById, createBoat, updateBoat } = useBoatService();

    const [boat, setBoat] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!id;

    useEffect(() => {
        const fetchBoat = async () => {
            if (!isEditMode) return;

            try {
                setIsLoading(true);
                const data = await getBoatById(id);
                setBoat(data);
            } catch (err) {
                console.error('Error fetching boat:', err);
                setError('Failed to load boat details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoat();
    }, [id, isEditMode]);

    const handleSubmit = async (formData) => {
        console.log('BoatPage handleSubmit called with:', formData);
        try {
            setIsSaving(true);
            setError(null);

            // Get profile ID from localStorage
            const profileId = localStorage.getItem('user_profile_id');
            if (!profileId) {
                throw new Error('User profile ID not found. Please log in again.');
            }

            const dataToSubmit = {
                ...formData,
                profileId: parseInt(profileId, 10)
            };

            if (isEditMode) {
                await updateBoat(id, dataToSubmit);
            } else {
                await createBoat(dataToSubmit);
            }

            navigate('/dashboard/skipper');
        } catch (err) {
            console.error('Error saving boat:', err);
            setError(err.message || 'Failed to save boat.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard/skipper'); // Or go back to previous page
    };

    if (isLoading) {
        return (
            <PageLayout>
                <div className="flex justify-center items-center h-full">
                    <PageLoader />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="content-layout">
                <div className="content-layout-content">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-400">
                            {error}
                        </div>
                    )}

                    <BoatForm
                        initialData={boat}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isLoading={isSaving}
                    />
                </div>
            </div>
        </PageLayout>
    );
};
