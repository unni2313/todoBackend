import { Router, RequestHandler } from 'express';
import Todo from '../models/Todo';

const router = Router();

// Get all todos
router.get('/', (async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}) as RequestHandler);

// Create todo
router.post('/', (async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      date: req.body.date
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}) as RequestHandler);

// Update todo
router.put('/:id', (async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.text = req.body.text || todo.text;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    todo.date = req.body.date || todo.date;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}) as RequestHandler);

// Delete todo
router.delete('/:id', (async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}) as RequestHandler);

export default router;