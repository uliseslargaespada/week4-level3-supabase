import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

function LoginPage({ onSignIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const destination =
    location.state?.from?.pathname ?? '/tasks';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSignIn(email.trim(), password);
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <p className="eyebrow">Welcome back</p>
          <h1 className="auth-card__title">Log in</h1>
          <p className="auth-card__subtitle">
            Continue where you left off with your personal tasks.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>

          {error && (
            <p
              role="alert"
              className="auth-form__feedback auth-form__feedback--error"
            >
              {error}
            </p>
          )}
        </form>

        <p className="auth-card__footer">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
