// Note: we are using Common js modules rather than ES6 modules as we are in nodejs now.
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI).then(() => console.log("MongoDB Connected succesfully"));

const app = express();
const port = process.env.PORT;

app.use(cors());
// This middleware is used, whenever we want to use req.body in our application.
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`Server is listening at Port ${port}`);
})