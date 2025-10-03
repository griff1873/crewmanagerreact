import { useState } from "react"
import {FaTrashAlt, FaCalendarPlus, FaPenSquare} from "react-icons/fa"
import { PageLayout } from "../components/page-layout";

const Content = () => {
  const [items, setItems] = useState([
    { id: 1, title: "Event 1", date: "2024-07-01" },
    { id: 2, title: "Event 2", date: "2024-07-05" },
    { id: 3, title: "Event 3", date: "2024-07-10" },
  ]);

  return (
    <div>
        <ul>
      {items.map((item) => (
        <li key={item.id}>
          <label>{item.title}</label>
          <label>{item.date}</label>
          <div>
            <FaPenSquare 
                role="button"
                tabIndex={0}
                onClick={() => alert(`Edit ${item.id}`)}
            />
            <FaTrashAlt
                role="button"
                tabIndex={1}
                onClick={() => alert(`Delete ${item.id}`)}
            />
          </div>

        </li>
        
      ))}
        </ul>
    </div>
  );
};
export const EventsPage = () => {
  return (
    <PageLayout>
        <div>
        <h1>Events Page</h1>
        <Content />
        </div>
    </PageLayout>
  );
}