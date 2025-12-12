/**
 * Custom hook that encapsulates all task-related Supabase logic:
 *  - load tasks
 *  - add task
 *  - toggle completion
 *  - delete task
 *  - (optional) realtime updates
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loads tasks from the Supabase "tasks" table.
   */
  const loadTasks = useCallback(async () => {
    // Set loading and errors
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from('tasks')
      .select('*')
      .order("created_at", { ascending: false });

    if (queryError) {
      setError('Error loading tasks: ' + queryError.message);
    } else {
      setTasks(data);
    }
    setLoading(false);
  }, []);

    /**
   * Adds a new task by inserting it into Supabase and updating local state.
   *
   * @param {string} title - New task title.
   */
  const addTask = useCallback(async (title) => {
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert([{ title, is_complete: false }])
      .select();

    if (insertError) {
       
      console.error(insertError);
      throw insertError;
    }

    const inserted = data?.[0];
    if (inserted) {
      setTasks((prev) => [inserted, ...prev]);
    }
  }, []);

  /** 
   * Toggles the is_complete flag of a task in Supabase and local state.
   *
   * @param {number} id - Task ID.
   * @param {boolean} isComplete - Desired completion state.
   */
  const toggleTask = useCallback(async (id, isComplete) => {
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ is_complete: isComplete })
      .eq("id", id);

    if (updateError) {
       
      console.error(updateError);
      throw updateError;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, is_complete: isComplete } : task
      )
    );
  }, []);

  /**
   * Deletes a task by id from Supabase and local state.
   *
   * @param {number} id - Task ID.
   */
  const deleteTask = useCallback(async (id) => {
    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (deleteError) {
       
      console.error(deleteError);
      throw deleteError;
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      await loadTasks();
    };
    
    fetchTasks();
  }, [loadTasks]);

  /**
   * Optional: Supabase Realtime subscription.
   * This keeps tasks in sync across multiple tabs.
   * You can comment this out if you want to keep Day 4 simpler.
   */
  useEffect(() => {
    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((prev) => {
            if (payload.eventType === "INSERT") {
              const newTask = payload.new;
              const exists = prev.some((task) => task.id === newTask.id);
              if (exists) return prev;
              return [newTask, ...prev];
            }

            if (payload.eventType === "UPDATE") {
              const updated = payload.new;
              return prev.map((task) =>
                task.id === updated.id ? updated : task
              );
            }

            if (payload.eventType === "DELETE") {
              const removed = payload.old;
              return prev.filter((task) => task.id !== removed.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask
  };
}

export { useTasks };
