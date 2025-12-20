import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { FaUsers, FaPen, FaTrash } from 'react-icons/fa';

const EventCard = ({ event, onEdit, onDelete }) => {
    const { id, name, date, description, confirmedCrew, wantedCrew } = event;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative">
            <div className="absolute top-2 right-2 flex space-x-2">
                {onEdit && (
                    <FaPen
                        className="text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                        size={14}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(id);
                        }}
                        title="Edit Event"
                    />
                )}
                {onDelete && (
                    <FaTrash
                        className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                        size={14}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(id);
                        }}
                        title="Delete Event"
                    />
                )}
            </div>

            <div className="flex flex-col mb-2 pr-16">
                <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                <span className="text-sm text-gray-500 mt-1">
                    {format(new Date(date), 'MMM dd, yyyy')}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {description}
            </p>

            <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
                <FaUsers className="mr-2 text-blue-500" />
                <span className="font-medium">
                    {confirmedCrew} / {wantedCrew} Crew Confirmed
                </span>
            </div>
        </div>
    );
};

EventCard.propTypes = {
    event: PropTypes.shape({
        name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        description: PropTypes.string,
        confirmedCrew: PropTypes.number.isRequired,
        wantedCrew: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default EventCard;
