import { useState, useRef, useEffect } from "react";

function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [multiline, setMultiline] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize: only grows when content actually wraps
  const handleChange = (e) => {
    setText(e.target.value);

    const ta = e.target;
    // Reset height to measure natural scroll height
    ta.style.height = "22px";
    const scrollH = ta.scrollHeight;
    ta.style.height = scrollH + "px";

    // Switch pill shape only when content wraps past 1 line
    setMultiline(scrollH > 28);
  };

  // Enter submits, Shift+Enter adds a newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
    setMultiline(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "22px";
    }
  };

  return (
    <div className="form-wrapper">
      <div className={`input-pill ${multiline ? "multiline" : ""}`}>
        <textarea
          ref={textareaRef}
          className="todo-input-area"
          placeholder="add your task here..."
          value={text}
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="add-btn"
          onClick={submit}
          type="button"
          title="Add task"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default TodoForm;