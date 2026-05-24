import { useEffect, useState } from "react";
import TodoForm from "./component/TodoForm";
import TodoList from "./component/TodoList";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "./services/api";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

  // ── FETCH ───────────────────────────────────────
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await getTodos();
      setTodos(response.data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  // ── ADD ─────────────────────────────────────────
  const handleAddTodo = async (text) => {
    try {
      const response = await createTodo({ text });
      setTodos((prev) => [...prev, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  // ── DELETE ──────────────────────────────────────
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      if (selectedTodo?._id === id) setSelectedTodo(null);
    } catch (err) {
      console.log(err);
    }
  };

  // ── TOGGLE (optimistic update — checkbox works instantly) ──
  const handleToggleTodo = async (todo) => {
    const toggled = { ...todo, completed: !todo.completed };

    // Update UI immediately — no waiting for server
    setTodos((prev) => prev.map((t) => t._id === todo._id ? toggled : t));
    if (selectedTodo?._id === todo._id) setSelectedTodo(toggled);

    try {
      await updateTodo(todo._id, { completed: toggled.completed });
    } catch (err) {
      // Revert if server call fails
      console.log(err);
      setTodos((prev) => prev.map((t) => t._id === todo._id ? todo : t));
      if (selectedTodo?._id === todo._id) setSelectedTodo(todo);
    }
  };

  // ── LOADING ─────────────────────────────────────
  if (loading) {
    return <div className="loading-screen">loading...</div>;
  }

  // ── MAIN UI ─────────────────────────────────────
  return (
    <div className="app">

      {/* Light-blue glassmorphism list container */}
      <div className="todo-glass-container">
        {error && <p className="error-msg">{error}</p>}

        {todos.length === 0 && !error && (
          <p className="empty-state">no tasks yet</p>
        )}

        <TodoList
          todos={todos}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onSelect={setSelectedTodo}
        />
      </div>

      {/* Input form below container */}
      <TodoForm onAdd={handleAddTodo} />

      {/* Detail overlay — slides in when a todo is selected */}
      {selectedTodo && (
        <div className="detail-overlay">
          <div className="detail-card">
            <button
              className="detail-back-btn"
              onClick={() => setSelectedTodo(null)}
            >
              ← back
            </button>

            <div className="detail-content">
              <input
                type="checkbox"
                className="detail-checkbox"
                checked={selectedTodo.completed}
                onChange={() => handleToggleTodo(selectedTodo)}
              />
              <p className={selectedTodo.completed ? "detail-text completed" : "detail-text"}>
                {selectedTodo.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;