import { useState } from 'react';

function AuthForm({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isSignUp = mode === 'sign-up';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const changeMode = () => {
    setMode((currentMode) =>
      currentMode === 'sign-in' ? 'sign-up' : 'sign-in',
    );
    setError('');
  };

  return (
    <section className="auth-card">
      <h2>{isSignUp ? 'Create account' : 'Log in'}</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          minLength={6}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting
            ? 'Please wait…'
            : isSignUp
              ? 'Create account'
              : 'Log in'}
        </button>

        {error && <p role="alert">{error}</p>}
      </form>

      <button type="button" onClick={changeMode}>
        {isSignUp
          ? 'Already have an account? Log in'
          : 'Need an account? Register'}
      </button>
    </section>
  );
}

export default AuthForm;