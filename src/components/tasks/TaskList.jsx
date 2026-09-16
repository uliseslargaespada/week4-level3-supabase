import { useMemo, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import TaskItem from './TaskItem.jsx';
import NewTaskForm from './NewTaskForm.jsx';
import { useTasks } from '../../hooks/useTasks.js';

/**
 * TaskList (Day 4):
 *  - Uses the custom useTasks hook for all Supabase interactions.
 *  - Manages filter state (All / Active / Completed).
 *  - Delegates add / toggle / delete actions to the hook.
 *  - Displays loading, error and summary information.
 */
function TaskList({ userId }) {
  const [filter, setFilter] = useState('all');
  const [actionError, setActionError] = useState('');

  const { 
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask
  } = useTasks(userId);

  /**
   * Adds a new task by inserting it into Supabase and updating local state.
   *
   * @param {string} title - Title of the new task.
   */
  const handleAddTask = async (title) => {
    setActionError('');
    await addTask(title);
  };

  /**
   * Toggles the is_complete flag of a task both in Supabase and local state.
   *
   * @param {number} id - Task ID.
   * @param {boolean} isComplete - Desired completion state.
   */
  const handleToggleComplete = async (id, isComplete) => {
    setActionError('');

    try {
      await toggleTask(id, isComplete);
    } catch (taskError) {
      setActionError(`Could not update the task: ${taskError.message}`);
    }
  };

  /**
   * Deletes a task by id from Supabase and local state.
   *
   * @param {number} id - Task ID.
   */
  const handleDeleteTask = async (id) => {
    setActionError('');

    try {
      await deleteTask(id);
    } catch (taskError) {
      setActionError(`Could not delete the task: ${taskError.message}`);
    }
  };

  // Derived summary information based on current tasks.
  // useMemo is for values
  // useCallback is for functions
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.is_complete,
  ).length;

  // Derived filtered list based on current filter state.
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === 'active') return !task.is_complete;
        if (filter === 'completed') return task.is_complete;
        return true;
      }),
    [tasks, filter],
  );

  return (
    <section className="card task-panel">
      <div className="task-panel__heading">
        <div>
          <p className="eyebrow">Task list</p>
          <h2>Today’s focus</h2>
        </div>

        {totalTasks > 0 && (
          <p className="task-summary" aria-live="polite">
            <strong>{completedTasks}</strong> of{' '}
            <strong>{totalTasks}</strong> complete
          </p>
        )}
      </div>

      <NewTaskForm onAddTask={handleAddTask} />

      <div className="task-filter" aria-label="Filter tasks">
        {['all', 'active', 'completed'].map((filterName) => (
          <button
            key={filterName}
            type="button"
            className={
              filter === filterName
                ? 'task-filter__button task-filter__button--active'
                : 'task-filter__button'
            }
            onClick={() => setFilter(filterName)}
            aria-pressed={filter === filterName}
          >
            {filterName}
          </button>
        ))}
      </div>

      {(error || actionError) && (
        <p className="error-text" role="alert">
          {error || actionError}
        </p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <div>
            <strong>No tasks yet</strong>
            <p>Add your first task above to get started.</p>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="loading-state" aria-live="polite">
          <Spinner animation="border" size="sm" />
          <span>Loading your tasks…</span>
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskList;
