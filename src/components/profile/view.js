

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
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
          <p><strong>Address:</strong> {profile.address || 'Not provided'}</p>
          <p><strong>Login ID:</strong> {loginId}</p>
        </div>
      </div>
      
      <div className="form-actions">
        <button onClick={onEdit}>Edit Profile</button>
        <button onClick={onNavigateToEvents}>Go to Events</button>
      </div>

    
    </div>
  );
};