import { useState, useEffect } from "react";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Load tasks from localStorage on mount
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Error loading tasks:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage when they change
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!newTask.trim()) {
      setError("Task cannot be empty");
      return;
    }

    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <form onSubmit={addTask} className="mb-6">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New task input"
          />
          {error && (
            <p role="alert" className="text-red-500 text-sm">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">
          No tasks yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 text-blue-500"
                  aria-label={`Mark "${task.text}" as ${
                    task.completed ? "incomplete" : "complete"
                  }`}
                />
                <span
                  className={`${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label={`Delete task "${task.text}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
          completed
        </div>
      )}
    </div>
  );
}

export default TaskManager;
