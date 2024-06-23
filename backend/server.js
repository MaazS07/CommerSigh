const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

 const uri = "mongodb+srv://Maaz:Maaz%401234@datascraping.ocfjxn7.mongodb.net/DataScraping?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const urlsRoute = require('./routes/urls');
const scrapeRoute = require('./routes/scrape');
app.use('/api/urls', urlsRoute);
app.use('/api/scrape', scrapeRoute);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
