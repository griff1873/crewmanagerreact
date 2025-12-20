import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/page-layout';
import { EventForm } from '../../components/events/event-form';
import { useEventService } from '../../services/event-service';

export const AddEventPage = () => {
  const navigate = useNavigate();
  const { createEvent } = useEventService();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (eventData) => {
    setIsLoading(true);
    try {
      await createEvent(eventData);
      navigate('/dashboard/skipper'); // Navigate back to dashboard after creation
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please check the form and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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