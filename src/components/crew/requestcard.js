import React from 'react';
import PropTypes from 'prop-types';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { GiSailboat, GiCaptainHatProfile } from 'react-icons/gi';
import format from 'date-fns/format';

const RequestCard = ({ request, onAccept, onDelete }) => {
    const {
        id,
        name,
        boatId,
        boatName,
        image,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        profileId
    } = request;

    return (
        <li className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-lg border border-gray-100">
            {/* Header: Image, Name, and Actions */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    {/* Circular image */}
                    <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                            {image ? (
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <GiCaptainHatProfile className="text-gray-400 text-2xl" />
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <h4 className="text-lg font-bold text-gray-800 leading-tight">{name}</h4>
                </div>

                {/* Actions - Right Justified */}
                <div className="flex space-x-2">
                    {onAccept && (
                        <button
                            onClick={() => onAccept(id)}
                            className="text-gray-400 hover:text-green-600 transition-colors p-1"
                            title="Accept crew request"
                        >
                            <FaCheck size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete crew request"
                        >
                            <FaTrashAlt size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Body: Boat Name and Meta */}
            <div className="mb-3 pl-1">
                {boatName && (
                    <p className="text-sm text-blue-600 flex items-center mb-2">
                        <GiSailboat className="mr-1" />
                        {boatName}
                    </p>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap gap-y-1 text-xs text-gray-500">
                    <div className="w-full flex justify-between items-center">
                        <span>Requested: {format(new Date(createdAt), 'MMM dd, yyyy')}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}

        </li>
    );
};

RequestCard.propTypes = {
    request: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        boatId: PropTypes.number.isRequired,
        boatName: PropTypes.string,
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
    onAccept: PropTypes.func,
    onDelete: PropTypes.func,
};

export default RequestCard;