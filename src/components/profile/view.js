import { FaPenSquare } from 'react-icons/fa';

export const ProfileView = ({ profile, user, loginId, onEdit, onNavigateToEvents }) => {
  return (
    <div className="profile-view">
      <div className="profile-details">
        {user?.picture && (
          <img 
            src={user.picture} 
            alt={profile.name} 
            className="profile-picture" 
          />
        )}
        <div className="profile-info">
          <p><strong>Name:</strong> <span className="profile-data">{profile.name}</span></p>
          <p><strong>Email:</strong> <span className="profile-data">{profile.email}</span></p>
          <p><strong>Phone:</strong> <span className="profile-data">{profile.phone || 'Not provided'}</span></p>
          <p><strong>Address:</strong> <span className="profile-data">{profile.address || 'Not provided'}</span></p>
          <p><strong>Login ID:</strong> <span className="profile-data">{loginId}</span></p>
        </div>
        
        <div className="profile-actions">
          <FaPenSquare 
            size={20}
            role="button"
            tabIndex={0}
            onClick={onEdit}
            title="Edit profile"
            className="action-icon edit-icon"
          />
        </div>
      </div>
    </div>
  );
};