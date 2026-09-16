import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function AppLayout({ user, onSignOut }) {
  const [signOutError, setSignOutError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSignOutError('');
    setSigningOut(true);

    try {
      await onSignOut();
    } catch (error) {
      setSignOutError(error.message);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__identity">
          <NavLink to="/" className="app-header__brand">
            Todo App
          </NavLink>

          {user && (
            <span className="app-header__user">
              {user.email}
            </span>
          )}
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className="main-nav__link"
          >
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/tasks"
                className="main-nav__link"
              >
                My Tasks
              </NavLink>

              <button
                type="button"
                className="main-nav__button"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? 'Logging out…' : 'Log out'}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="main-nav__link"
              >
                Log in
              </NavLink>

              <NavLink
                to="/register"
                className="main-nav__link"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>

        {signOutError && (
          <p className="app-header__error" role="alert">
            {signOutError}
          </p>
        )}
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>Level 3 · React + Supabase</p>
      </footer>
    </div>
  );
}

export default AppLayout;
