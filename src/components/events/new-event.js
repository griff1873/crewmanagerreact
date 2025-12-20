import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../page-layout';
import { EventForm } from './event-form';
import { useEventService } from '../../services/event-service';

export const NewEventPage = () => {
    const navigate = useNavigate();
    const { createEvent } = useEventService();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (eventData) => {
        setIsLoading(true);
        try {
            await createEvent(eventData);
            navigate('/dashboard'); // Or navigate to the new event detail page
        } catch (error) {
            console.error("Failed to create event:", error);
            // Error handling is managed within the form or service ideally, 
            // but we could set a global error state here if needed.
            alert("Failed to create event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back
    };

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <EventForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            </div>
        </PageLayout>
    );
};
