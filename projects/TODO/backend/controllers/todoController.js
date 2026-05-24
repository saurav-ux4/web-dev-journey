const Todo = require("../models/Todo");



// GET all todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();

    res.json(todos);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// CREATE todo
const createTodo = async (req, res) => {
  try {
    const newTodo = await Todo.create({
      text: req.body.text
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// UPDATE todo
const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,

      {
        completed: req.body.completed
      },

      {
        new: true
      }
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// DELETE todo
const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      message: "Todo deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};