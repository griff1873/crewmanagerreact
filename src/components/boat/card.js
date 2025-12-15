import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

const BoatCard = ({ boat }) => {
    const {
        id,
        name,
        description,
        image,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy
    } = boat;

    return (
        <div className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg group bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Image with overlay */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image || '/images/defaultboat.png'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/defaultboat.png';
                    }}
                />
            </div>
            {/* Name positioned below image */}
            <div className="p-4 pt-0">
                <h3 className="text-xl font-bold text-blue-600 mb-2">{name}</h3>
                <p className="text-gray-700 line-clamp-3 text-sm">
                    {description || 'No description available'}
                </p>
            </div>
        </div>
    );
};

BoatCard.propTypes = {
    boat: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        image: PropTypes.string,
        profileId: PropTypes.number.isRequired,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        isDeleted: PropTypes.bool,
        deletedBy: PropTypes.string,
        deletedAt: PropTypes.string,
        createdBy: PropTypes.string,
        updatedBy: PropTypes.string,
    }).isRequired,
};

export default BoatCard;
