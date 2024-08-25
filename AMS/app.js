const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes.js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the 'client/dist' directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// Define your API routes
app.use('/user', userRouter);

// Catch-all route to handle unmatched requests (this should be the last route)
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

module.exports = app;
