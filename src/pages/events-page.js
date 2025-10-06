import { useState } from "react"
import AddEvent from "../components/events/add-event"
import {FaTrashAlt, FaCalendarPlus, FaPenSquare, FaUserPlus, FaUserMinus} from "react-icons/fa"
import { PageLayout } from "../components/page-layout";

const Content = ({ items, handleUserAdd, handleUserRemove, handleEdit, handleDelete }) => {
  return (
    <div>
        <ul>
            {items.map((item) => (
                <li className="item" key={item.id}>
                <label>{item.title}</label>
                <label>{item.date}</label>
                <div>
                    <FaUserPlus 
                        size={24}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleUserAdd(item.id)}
                    />
                    <FaUserMinus
                        size={24}
                        role="button"
                        tabIndex={1}
                        onClick={() => handleUserRemove(item.id)}
                    />
                    <FaPenSquare 
                        size={24}
                        role="button"
                        tabIndex={2}
                        onClick={() => handleEdit(item.id)}
                    />
                    <FaTrashAlt
                        size={24}
                        role="button"
                        tabIndex={3}
                        onClick={() => handleDelete(item.id)}
                    />
                </div>
                </li>
            ))}
        </ul>
    </div>
  );
};

export const EventsPage = () => {
  const [items, setItems] = useState([
    { id: 1, title: "Event 1", date: "2024-07-01" },
    { id: 2, title: "Event 2", date: "2024-07-05" },
    { id: 3, title: "Event 3", date: "2024-07-10" },
  ]);

  // Initialize with today's date
  const today = new Date().toISOString().split('T')[0];
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    date: today, 
    time: "", 
    description: "" 
  });

  const handleUserAdd = (id) => {
      alert(`Add user to ${id}`);
  };      
  const handleUserRemove = (id) => {
      alert(`Remove user from ${id}`);
  };      
  const handleEdit = (id) => {
      alert(`Edit ${id}`);
  };      
  const handleDelete = (id) => {
      setItems(items.filter(item => item.id !== id));
  };
  const handleSubmit = (e) => {
      e.preventDefault();
      if (newEvent.title && newEvent.date && newEvent.time) {
          const newId = items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
          setItems([...items, { id: newId, title: newEvent.title, date: newEvent.date }]);
          setNewEvent({ title: "", date: "", time: "", description: "" });
      }
  };

  return (
    <PageLayout>
        <div>
            <AddEvent
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              handleSubmit={handleSubmit}
            />
            <Content 
              items={items}
              handleUserAdd={handleUserAdd}
              handleUserRemove={handleUserRemove}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
        </div>
    </PageLayout>
  );
}