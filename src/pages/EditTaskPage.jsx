import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import EditTaskForm from '../components/tasks/EditTaskForm.jsx';
import { supabase } from '../lib/supabaseClient.js';

function EditTaskPage({ userId }) {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    const loadTask = async () => {
      setLoading(true);
      setLoadError('');
      setTask(null);

      const validTaskId = /^[1-9]\d*$/.test(taskId ?? '');

      if (!userId || !validTaskId) {
        if (active) {
          setLoadError('Task not found or unavailable.');
          setLoading(false);
        }

        return;
      }

      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(
            'id, title, is_complete, user_id, created_at',
          )
          .eq('id', taskId)
          .eq('user_id', userId)
          .maybeSingle();

        if (!active) return;

        if (error) {
          throw error;
        }

        if (!data) {
          setLoadError('Task not found or unavailable.');
          return;
        }

        setTask(data);
      } catch {
        if (active) {
          setLoadError(
            'Could not load the task. Check your connection and try again.',
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

  const handleSaveTask = async (values) => {
    if (!userId || !task) {
      throw new Error(
        'Your session or task is unavailable. Log in and try again.',
      );
    }

    // Explicitly list the only fields this feature can change.
    const changes = {
      title: values.title,
      is_complete: values.is_complete,
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(changes)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select(
        'id, title, is_complete, user_id, created_at',
      )
      .maybeSingle();

    if (error) {
      throw new Error(
        'Could not save the task. Check your connection and permissions, then try again.',
      );
    }

    if (!data) {
      throw new Error(
        'The task could not be updated. It may have been deleted or become unavailable.',
      );
    }

    navigate(`/tasks/${data.id}`, {
      replace: true,
      state: {
        taskUpdated: true,
      },
    });
  };

  const handleCancel = () => {
    navigate(`/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <div className="loading-state" role="status">
        Loading task…
      </div>
    );
  }

  if (loadError || !task) {
    return (
      <section className="task-details">
        <h1 className="task-details__title">
          Task unavailable
        </h1>

        <p className="error-text" role="alert">
          {loadError || 'Task not found or unavailable.'}
        </p>

        <Link className="task-details__back" to="/tasks">
          ← Return to tasks
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page__header">
        <p className="eyebrow">Your workspace</p>

        <h1 className="page__title">Edit task</h1>

        <p className="page__description">
          Update the title or completion status of your task.
        </p>
      </header>

      <div className="card task-edit-card">
        <EditTaskForm
          key={task.id}
          task={task}
          onSave={handleSaveTask}
          onCancel={handleCancel}
        />
      </div>
    </section>
  );
}

export default EditTaskPage;
