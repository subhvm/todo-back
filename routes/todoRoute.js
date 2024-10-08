const express = require('express');
const router = express.Router();
const Todo = require('../models/todoModel');
const authMiddleware = require('../middleware/authMid');


router.get('/', authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id });
        res.json(todos);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.post('/', authMiddleware, async (req, res) => {
    const { title, description } = req.body;

    try {
        const newTodo = new Todo({
            user: req.user._id,
            title, description
        });

        const todo = await newTodo.save();
        res.status(201).json(todo);
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// PUT route to update a todo
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        

        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (!todo.user || todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await todo.remove();
        res.json({ message: 'Todo removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;
