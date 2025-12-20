import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/page-layout';
import { EventForm } from '../../components/events/event-form';
import { useEventService } from '../../services/event-service';
import { PageLoader } from '../../components/page-loader';

export const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getEventById, updateEvent } = useEventService();
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            setIsFetching(true);
            try {
                const event = await getEventById(id);
                if (event) {
                    setInitialData(event);
                } else {
                    alert("Event not found");
                    navigate('/dashboard/skipper');
                }
            } catch (error) {
                console.error("Failed to fetch event:", error);
                alert("Failed to load event details.");
            } finally {
                setIsFetching(false);
            }
        };
        fetchEvent();
    }, [id, getEventById, navigate]);

    const handleSubmit = async (eventData) => {
        setIsLoading(true);
        try {
            await updateEvent(id, eventData);
            navigate('/dashboard/skipper');
        } catch (error) {
            console.error("Failed to update event:", error);
            alert("Failed to update event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (isFetching) {
        return (
            <PageLayout>
                <PageLoader />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <EventForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            </div>
        </PageLayout>
    );
};
