const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const httpResponder = require('./middleware/httpResponder');

const PORT = 5000;

// route imports
const userRoute = require('./routes/userRoute');
const bugsRoute = require('./routes/bugsRoute');
const commentsRoute = require('./routes/commentsRoute');

// connect to database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => console.log("Failed to connect to database."));

app.set("env", process.env.NODE_ENV);

// middlewares
app.use(httpResponder);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use('/api/user', userRoute);
app.use('/api/bugs', bugsRoute);
app.use('/api/bugs', commentsRoute);

// finally handle errors
app.use("*", function (req, res) {
  res.notFound({ error: 'Not Found' });
});

app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError) {
    res.status(400).send({ error: "Something Unknown Happened" });
  } else next();
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));