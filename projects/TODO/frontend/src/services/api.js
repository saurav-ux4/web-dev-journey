import axios from "axios";

const API = axios.create({
  baseURL: "https://web-dev-journey-pxj9.onrender.com"
});



export const getTodos = () => API.get("/todos");

export const createTodo = (todo) =>
  API.post("/todos", todo);

export const deleteTodo = (id) =>
  API.delete(`/todos/${id}`);

export const updateTodo = (id, updatedTodo) =>
  API.put(`/todos/${id}`, updatedTodo);