require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/stats', require('./routes/stats'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Da ket noi MongoDB');
        app.listen(process.env.PORT, () =>
            console.log('Server chay o cong ' + process.env.PORT));
    })
    .catch(err => console.error('Loi ket noi MongoDB:', err.message));