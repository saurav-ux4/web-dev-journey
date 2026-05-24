const express = require("express");

const router = express.Router();

const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require("../controllers/todoController");



// GET all todos
router.get("/", getTodos);



// CREATE todo
router.post("/", createTodo);



// UPDATE todo
router.put("/:id", updateTodo);



// DELETE todo
router.delete("/:id", deleteTodo);



module.exports = router;