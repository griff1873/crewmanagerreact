import React from "react";

const AddEvent = ({ newEvent, setNewEvent, handleSubmit }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Event Title:</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          value={newEvent.title}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Event Date:</label>
        <input 
          type="date" 
          id="date" 
          name="date" 
          value={newEvent.date || today}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="time">Start Time:</label>
        <input 
          type="time" 
          id="time" 
          name="time" 
          value={newEvent.time}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea 
          id="description" 
          name="description"
          value={newEvent.description}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Event
      </button>
    </form>
  );
};

export default AddEvent;