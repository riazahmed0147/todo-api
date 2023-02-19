const express = require('express');
const mongoose = require('mongoose');

const todos = require('./routes/api/todos');
const users = require('./routes/api/users');
const comments = require('./routes/api/comments');
const auth = require('./routes/api/auth');

const app = express();

// DB Config
const db = require('./config/keys').dbUri;

// Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

// Init Middleware
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

// Use Routes
app.use('/api/todos', todos);
app.use('/api/users', users);
app.use('/api/comments', comments);
app.use('/api/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));