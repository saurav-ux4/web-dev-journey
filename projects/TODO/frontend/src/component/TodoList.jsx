import TodoItem from "./TodoItem";

function TodoList({ todos, onDelete, onToggle, onSelect }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default TodoList;