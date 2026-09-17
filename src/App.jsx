import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import GuestOnlyRoute from './components/routing/GuestOnlyRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import TaskDetailsPage from './pages/TaskDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import EditTaskPage from './pages/EditTaskPage.jsx';
import { useAuth } from './hooks/useAuth.js';

function App() {
  const {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  } = useAuth();

  if (loading) {
    return (
      <main className="session-loading" aria-live="polite">
        <span className="session-loading__spinner" aria-hidden="true" />
        <p>Restoring your session…</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            user={user}
            onSignOut={signOut}
          />
        }
      >
        <Route index element={<HomePage user={user} />} />

        <Route element={<GuestOnlyRoute user={user} />}>
          <Route
            path="login"
            element={<LoginPage onSignIn={signIn} />}
          />
          <Route
            path="register"
            element={<RegisterPage onSignUp={signUp} />}
          />
        </Route>

        <Route element={<ProtectedRoute user={user} />}>
          <Route
            path="tasks"
            element={<TasksPage userId={user?.id} />}
          />
          <Route
            path="tasks/:taskId"
            element={<TaskDetailsPage userId={user?.id} />}
          />
          <Route
            path="tasks/:taskId/edit"
            element={<EditTaskPage userId={user?.id} />}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
