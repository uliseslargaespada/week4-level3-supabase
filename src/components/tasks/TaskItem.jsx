/**
 * Displays a single task as a list item (read-only on Day 2).
 *
 * @param {object} props
 * @param {{ id: number, title: string, is_complete: boolean, inserted_at?: string }} props.task
 */
export default function TaskItem({ task }) {
  return (
    <li className="task-item">
      <div className="task-item__content">
        <span
          className={
            task.is_complete
              ? "task-item__title task-item__title--done"
              : "task-item__title"
          }
        >
          {task.title}
        </span>
      </div>
    </li>
  );
}