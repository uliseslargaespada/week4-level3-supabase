import { useEffect, useState } from 'react';

import {
  Link,
  useLocation,
  useParams,
} from 'react-router-dom';

import { supabase } from '../lib/supabaseClient.js';

function TaskDetailsPage({ userId }) {
  const { taskId } = useParams();
  const location = useLocation();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const taskUpdated =
    location.state?.taskUpdated === true;

  useEffect(() => {
    let active = true;

    const loadTask = async () => {
      setLoading(true);
      setError('');
      setTask(null);

      try {
        const {
          data,
          error: queryError,
        } = await supabase
          .from('tasks')
          .select(
            'id, title, is_complete, user_id, created_at',
          )
          .eq('id', taskId)
          .eq('user_id', userId)
          .maybeSingle();

        if (!active) return;

        if (queryError || !data) {
          setError('Task not found or unavailable.');
          return;
        }

        setTask(data);
      } catch {
        if (active) {
          setError(
            'Could not load the task. Try again.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTask();

    return () => {
      active = false;
    };
  }, [taskId, userId]);

  if (loading) {
    return (
      <div className="loading-state" role="status">
        Loading task…
      </div>
    );
  }

  if (error || !task) {
    return (
      <section className="task-details">
        <h1 className="task-details__title">
          Task unavailable
        </h1>

        <p className="error-text" role="alert">
          {error || 'Task not found or unavailable.'}
        </p>

        <Link className="task-details__back" to="/tasks">
          ← Return to tasks
        </Link>
      </section>
    );
  }

  return (
    <article className="task-details">
      {taskUpdated && (
        <p className="task-edit-notice" role="status">
          Task updated successfully.
        </p>
      )}

      <p className="eyebrow">Task details</p>

      <h1 className="task-details__title">
        {task.title}
      </h1>

      <p className="task-details__status">
        {task.is_complete ? 'Completed' : 'Active'}
      </p>

      <div className="task-details-actions">
        <Link
          className="task-edit-link"
          to={`/tasks/${task.id}/edit`}
        >
          Edit task
        </Link>

        <Link className="task-details__back" to="/tasks">
          ← Return to tasks
        </Link>
      </div>
    </article>
  );
}

export default TaskDetailsPage;