const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config()
// import {newUser} from './api/userApi'

const cors = require('cors');
app.use(cors());

app.use(express.json());


const source = process.env.ATLAS_CONNECTION

mongoose.connect(source, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB Connected');
});

const userRoutes = require('./api/userApi');

app.use('/users', userRoutes);

// console.log(req.body);
// console.log(newUser);

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Successfully served on port: ${PORT}.`);
})