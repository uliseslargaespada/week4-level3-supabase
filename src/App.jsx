import MainLayout from "./components/layout/MainLayout.jsx";
import TaskList from "./components/tasks/TaskList.jsx";

/**
 * Root App component.
 * Renders the TaskList inside the shared layout.
 */
export default function App() {
  return (
    <MainLayout>
      <TaskList />
    </MainLayout>
  );
}