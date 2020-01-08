const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const morgan = require('morgan');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const httpResponder = require('./middleware/httpResponder');
const errorHandler = require('./middleware/errorHandler');


// connect to database
mongoose.connect(
  process.env.DB_CONNECT_ATLAS,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Connected to database'))
  .catch(() => console.log("Failed to connect to database."));



// express settings
app.set("env", process.env.NODE_ENV);

// middlewares
app.use(express.static('client/build'));
app.use(helmet()) // security headers
app.use(cors());
app.use(httpResponder);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(mongoSanitize()); // sanitization against NoSQL Injection Attacks
app.use(xss()); // sanitize data
// rateLimiter
app.use('/api/', rateLimit({
  windowMs: 25 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests!, please try again after 25mins" }
}));
app.use(morgan('dev'));


// routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/user', require('./routes/imagesRoute'));
app.use('/api/bugs', require('./routes/bugsRoute'));
app.use('/api/bugs', require('./routes/commentsRoute'));

// let routes = new Set();
// function print(path, layer) {
//   if (layer.route) {
//     layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
//   } else if (layer.name === 'router' && layer.handle.stack) {
//     layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
//   } else if (layer.method) {
//     routes.add(
//       layer.method.toUpperCase() + ' - ' + path.concat(split(layer.regexp)).filter(Boolean).join('/')
//     )
//   }
// }

// function split(thing) {
//   if (typeof thing === 'string') {
//     return thing.split('/')
//   } else if (thing.fast_slash) {
//     return ''
//   } else {
//     var match = thing.toString()
//       .replace('\\/?', '')
//       .replace('(?=\\/|$)', '$')
//       .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
//     return match
//       ? match[1].replace(/\\(.)/g, '$1').split('/')
//       : '<complex:' + thing.toString() + '>'
//   }
// }

// app._router.stack.forEach(print.bind(null, []))

// console.log(routes)



// finally handle errors
app.use(errorHandler);
app.use("/api/*", function (req, res) {
  res.notImplemented({ error: 'Not Implemented.' });
});


// Server Side Routing
// If no API routes are hit, send the React app
if (process.env.NODE_ENV === 'production') {
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'), function (err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  });
}


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));