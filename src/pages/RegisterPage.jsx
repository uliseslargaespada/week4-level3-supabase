import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage({ onSignUp }) {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] =
    useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const data = await onSignUp(
        displayName.trim(),
        email.trim(),
        password,
      );

      if (!data.session) {
        setMessage(
          'Account created. Check your email to confirm your account.',
        );
        setPassword('');
        setPasswordConfirmation('');
        return;
      }

      navigate('/tasks', { replace: true });
    } catch (registrationError) {
      setError(registrationError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <p className="eyebrow">Welcome</p>
          <h1 className="auth-card__title">Create an account</h1>
          <p className="auth-card__subtitle">
            Register to keep your task list private and available on
            every device.
          </p>
        </header>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-form__field">
            <label htmlFor="register-name">
              Display name
            </label>

            <input
              id="register-name"
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="register-confirm-password">
              Confirm password
            </label>

            <input
              id="register-confirm-password"
              type="password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(event.target.value)
              }
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting
              ? 'Creating account…'
              : 'Create account'}
          </button>

          {error && (
            <p
              role="alert"
              className="auth-form__feedback auth-form__feedback--error"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="auth-form__feedback auth-form__feedback--success"
            >
              {message}
            </p>
          )}
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
