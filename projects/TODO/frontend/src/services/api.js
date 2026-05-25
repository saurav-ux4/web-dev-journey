import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-app-hbze.onrender.com"
});



export const getTodos = () => API.get("/todos");

export const createTodo = (todo) =>
  API.post("/todos", todo);

export const deleteTodo = (id) =>
  API.delete(`/todos/${id}`);

export const updateTodo = async (id, updatedTodo) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    updatedTodo
  );

  return response.data;
};