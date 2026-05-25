function TodoItem({ todo, onDelete, onToggle, onSelect }) {

  const handleCheckbox = (e) => {
    e.stopPropagation();
    onToggle(todo);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(todo._id);
  };

  return (
    <div
      className="todo-item"
      onClick={() => onSelect && onSelect(todo)}
    >
      {/*
        onChange stops the change event.
        onClick stops the click event from bubbling to the parent div.
        Both are needed — without onClick, the detail view still opens.
      */}
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleCheckbox}
        onClick={(e) => e.stopPropagation()}
      />

      <span className={todo.completed ? "todo-text completed" : "todo-text"}>
        {todo.text}
      </span>

      <button
        className="delete-btn"
        onClick={handleDelete}
        title="Delete task"
      />
    </div>
  );
}

export default TodoItem;