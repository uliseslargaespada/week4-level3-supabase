import TaskList from '../components/tasks/TaskList.jsx';

function TasksPage({ userId }) {
  return (
    <section className="page">
      <header className="page__header">
        <p className="eyebrow">Your workspace</p>
        <h1 className="page__title">My Tasks</h1>
        <p className="page__description">
          Add a task, mark it complete, or open it for more details.
        </p>
      </header>
      <TaskList userId={userId} />
    </section>
  );
}

export default TasksPage;
