import React from 'react';
import { GiSailboat } from 'react-icons/gi';
import { FaPen, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

const BoatCard = ({ boat, onEdit, onDelete }) => {
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

    const [imgError, setImgError] = React.useState(false);

    return (
        <div className="flex flex-row w-full max-w-full overflow-hidden rounded-2xl shadow-md group bg-white transition-all duration-300 hover:shadow-lg border border-gray-100">
            {/* Image Section - Left Side */}
            <div className="relative w-1/3 min-w-[120px] overflow-hidden flex items-center justify-center bg-gray-50">
                {image && !imgError ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <GiSailboat className="text-gray-300" size={48} />
                )}
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-1 p-3 flex flex-col justify-center relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                    {onEdit && (
                        <FaPen
                            className="text-gray-400 hover:text-blue-500 cursor-pointer transition-colors"
                            size={16}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(id);
                            }}
                            title="Edit Boat"
                        />
                    )}
                    {onDelete && (
                        <FaTrash
                            className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                            size={16}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(id);
                            }}
                            title="Delete Boat"
                        />
                    )}
                </div>
                <h3 className="text-lg font-bold text-blue-600 mb-1 pr-16">{name}</h3>
                <p className="text-gray-600 line-clamp-2 text-xs">
                    {description || 'No description available'}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                    {/* Optional: Add capacity or length here if desired, e.g. 
                    <span>{boat.length}ft • {boat.capacity} ppl</span> 
                    */}
                </div>
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
