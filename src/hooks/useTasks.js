/**
 * Custom hook that encapsulates all task-related Supabase logic:
 *  - load tasks
 *  - add task
 *  - toggle completion
 *  - delete task
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loads tasks from the Supabase "tasks" table.
   */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (queryError) {
      setError(`Could not load tasks: ${queryError.message}`);
    } else {
      setTasks(data ?? []);
    }

    setLoading(false);
  }, [userId]);

  /**
   * Adds a new task by inserting it into Supabase and updating local state.
   *
   * @param {string} title - New task title.
   */
  const addTask = useCallback(
    async (title) => {
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([{ title, is_complete: false, user_id: userId }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setTasks((currentTasks) => [data, ...currentTasks]);
    },
    [userId],
  );

  /** 
   * Toggles the is_complete flag of a task in Supabase and local state.
   *
   * @param {number} id - Task ID.
   * @param {boolean} isComplete - Desired completion state.
   */
  const toggleTask = useCallback(
    async (id, isComplete) => {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ is_complete: isComplete })
        .eq('id', id)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? { ...task, is_complete: isComplete }
            : task,
        ),
      );
    },
    [userId],
  );

  /**
   * Deletes a task by id from Supabase and local state.
   *
   * @param {number} id - Task ID.
   */
  const deleteTask = useCallback(
    async (id) => {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (deleteError) {
        throw deleteError;
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id),
      );
    },
    [userId],
  );

  useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks();
    };

    fetchTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
  };
}

export { useTasks };
