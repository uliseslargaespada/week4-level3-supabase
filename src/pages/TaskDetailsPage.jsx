import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';

function TaskDetailsPage({ userId }) {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadTask = async () => {
      setLoading(true);
      setError('');

      const {
        data,
        error: queryError,
      } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!active) return;

      if (queryError || !data) {
        setError('Task not found.');
        setTask(null);
      } else {
        setTask(data);
      }

      setLoading(false);
    };

    loadTask();

    return () => {
      active = false;
    };
  }, [taskId, userId]);

  if (loading) {
    return (
      <div className="loading-state" aria-live="polite">
        Loading task…
      </div>
    );
  }

  if (error) {
    return (
      <section className="task-details">
        <p className="error-text" role="alert">{error}</p>
        <Link className="task-details__back" to="/tasks">
          ← Return to tasks
        </Link>
      </section>
    );
  }

  return (
    <article className="task-details">
      <p className="eyebrow">Task details</p>
      <h1 className="task-details__title">{task.title}</h1>
      <p className="task-details__status">
        {task.is_complete ? 'Completed' : 'Active'}
      </p>
      <Link className="task-details__back" to="/tasks">
        ← Return to tasks
      </Link>
    </article>
  );
}

export default TaskDetailsPage;
