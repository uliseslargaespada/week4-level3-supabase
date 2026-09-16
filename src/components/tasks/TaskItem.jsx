import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Displays a single task as a list item (read-only on Day 2).
 *
 * @param {object} props
 * @param {{ id: number, title: string, is_complete: boolean, inserted_at?: string }} props.task
 * @param {(id: number) => void} props.onToggleComplete
 * @param {(id: number) => void} props.onDelete
 */
export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const [working, setWorking] = useState(false);

  /**
   * Handles checkbox changes and notifies the parent component.
   */
  const handleToggle = async () => {
    setWorking(true);
    await onToggleComplete(task.id, !task.is_complete);
    setWorking(false);
  };

  /**
   * Handles delete button clicks and notifies the parent component.
   */
  const handleDelete = async () => {
    setWorking(true);
    await onDelete(task.id);
    setWorking(false);
  };

  return (
    <li className="task-item">
      <div className="task-item__content">
        <input
          id={`task-${task.id}`}
          type="checkbox"
          checked={task.is_complete}
          onChange={handleToggle}
          disabled={working}
          aria-label={`Mark ${task.title} as ${
            task.is_complete ? 'active' : 'complete'
          }`}
        />
        <Link className="task-item__link" to={`/tasks/${task.id}`}>
          <span
            className={
              task.is_complete
                ? "task-item__title task-item__title--done"
                : "task-item__title"
            }
          >
            {task.title}
          </span>
        </Link>
      </div>
      <button
        type="button"
        className="task-item__delete"
        onClick={handleDelete}
        disabled={working}
        aria-label={`Delete ${task.title}`}
      >
        ✕
      </button>
    </li>
  );
}
