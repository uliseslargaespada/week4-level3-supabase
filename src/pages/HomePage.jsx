import { Link } from 'react-router-dom';

function HomePage({ user }) {
  return (
    <section className="home-page">
      <p className="eyebrow">A focused space for your work</p>
      <h1 className="home-page__title">
        Make room for what matters.
      </h1>
      <p className="home-page__description">
        Capture your next task, track your progress, and keep every
        item protected in your own Supabase account.
      </p>

      <Link
        className="home-page__action"
        to={user ? '/tasks' : '/register'}
      >
        {user ? 'View my tasks' : 'Create an account'}
      </Link>
    </section>
  );
}

export default HomePage;
