import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="eyebrow">Error 404</p>
      <h1 className="not-found-page__title">Page not found</h1>
      <p className="not-found-page__description">
        The page you requested does not exist or may have moved.
      </p>
      <Link className="not-found-page__action" to="/">
        Return home
      </Link>
    </section>
  );
}

export default NotFoundPage;
