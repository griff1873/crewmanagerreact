import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { FaUsers } from 'react-icons/fa';

const EventCard = ({ event }) => {
    const { name, date, description, confirmedCrew, wantedCrew } = event;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{name}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
    }).isRequired,
};

export default EventCard;
