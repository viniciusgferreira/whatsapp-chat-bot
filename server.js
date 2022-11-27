const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello, server is running.'))

app.listen(3000, function () {
    console.log(`Server running on http://localhost:${port}`);
})