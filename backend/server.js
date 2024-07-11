require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const authRoutes = require('./routes/authRoutes');
const amazonRoute = require('./routes/amazon');
const flipkartRoute = require('./routes/flipkart');

app.use('/api/auth', authRoutes);
app.use('/api/amazon', amazonRoute);
app.use('/api/flipkart', flipkartRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});