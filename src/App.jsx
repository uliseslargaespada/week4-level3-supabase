import { useState } from "react";
import MainLayout from "./components/layout/MainLayout.jsx";
import TaskList from "./components/tasks/TaskList.jsx";
import AuthForm from "./components/auth/AuthForm.jsx";
import { useAuth } from "./hooks/useAuth.js";

/**
 * Root App component.
 * Renders the TaskList inside the shared layout.
 * We're using a single page application structure for simplicity.
 *
 * @returns {JSX.Element} The App component.
 */
export default function App() {
  const {
    // session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
  } = useAuth();

  const [signOutError, setSignOutError] = useState('');

  const handleSignOut = async () => {
    try {
      setSignOutError('');

      await signOut();
    } catch (error) {
      setSignOutError(error.message);
    }
  };

  if (loading) {
    return (
      <p>Restoring Session...</p>
    );
  }

  return (
    <MainLayout>
      {!user ? (
        <AuthForm
          onSignIn={signIn}
          onSignUp={signUp}
        />
      ) : (
        <>
          <div className="session-bar">
            <span>Signed in as {user.email}</span>

            <button type="button" onClick={handleSignOut}>
              Log out
            </button>

            {signOutError && <p role="alert">{signOutError}</p>}
          </div>

          <TaskList userId={user.id} />
        </>
      )}
    </MainLayout>
  );
}