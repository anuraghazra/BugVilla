const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const httpResponder = require('./middleware/httpResponder');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

const PORT = 5000;

// route imports
const userRoute = require('./routes/userRoute');
const bugsRoute = require('./routes/bugsRoute');
const commentsRoute = require('./routes/commentsRoute');

// connect to database
mongoose.connect(process.env.DB_CONNECT_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => console.log("Failed to connect to database."));

// express settings
app.set("env", process.env.NODE_ENV);

// middlewares
app.use(helmet()) // security headers
app.use(cors());
app.use(httpResponder);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(mongoSanitize()); // sanitization against NoSQL Injection Attacks
app.use(xss()); // sanitize data

// rateLimiter
const limiter = rateLimit({
  windowMs: 25 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests!, please try again after 25mins" }
});
app.use('/api/', limiter);

// skip: (req, res) => return res.statusCode < 400,
// stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('dev'));

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