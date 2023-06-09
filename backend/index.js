const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tasker',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

// API Endpoints

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(query, [title, description], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      res.status(500).json({ error: 'Error creating task' });
    } else {
      res.status(201).json({ message: 'Task created successfully' });
    }
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving tasks:', err);
      res.status(500).json({ error: 'Error retrieving tasks' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Update a task
app.put('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
  db.query(query, [title, description, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ error: 'Error updating task' });
    } else {
      res.status(200).json({ message: 'Task updated successfully' });
    }
  });
});

// Delete a task
app.delete('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Error deleting task' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
