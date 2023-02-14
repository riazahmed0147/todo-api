const express = require('express');
const mongoose = require('mongoose');

const todos = require('./routes/api/todos');

const app = express();

// Connect to MongoDB
mongoose
	.connect('mongodb://127.0.0.1:27017/todo-app', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Use Routes
app.use('/api/todos', todos);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));