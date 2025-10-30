import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { PageLoader } from "./components/page-loader";
import { AuthenticationGuard } from "./components/authentication-guard";
import { HomePage } from "./pages/home-page";
import { CalendarPage } from "./pages/calendar-page";
import { ProfilePage } from "./pages/profile-page";
import { EventsPage } from "./pages/events-page";
import { CallbackPage } from "./pages/callback-page";
import { NotFoundPage } from "./pages/not-found-page";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";

import "./app.css";

const AuthenticatedApp = () => {
  const { profileLoading, profileError, hasProfile, hasChecked } = useProfile();

  // Show loading while checking profile
  if (profileLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
        <div>Loading profile...</div>
      </div>
    );
  }

  // Show error if there's a server error but still allow navigation
  if (profileError && profileError.includes("500")) {
    console.warn(
      "Profile check failed with server error, but allowing app to continue"
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route
        path="/events"
        element={<AuthenticationGuard component={EventsPage} />}
      />
      <Route
        path="/calendar"
        element={<AuthenticationGuard component={CalendarPage} />}
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const AppWithProfile = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  return isAuthenticated ? (
    <ProfileProvider>
      <AuthenticatedApp />
    </ProfileProvider>
  ) : (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const App = () => {
  return <AppWithProfile />;
};
