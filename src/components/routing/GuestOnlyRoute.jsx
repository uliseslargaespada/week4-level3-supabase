import { Navigate, Outlet } from 'react-router-dom';

function GuestOnlyRoute({ user }) {
  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}

export default GuestOnlyRoute;