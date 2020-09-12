const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const expressStaticGzip = require('express-static-gzip');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const compression = require('compression');
const httpResponder = require('./middleware/httpResponder');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const cookieParser = require('cookie-parser');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// connect to database
mongoose
  .connect(process.env.DB_CONNECT_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Failed to connect to database.'));

// express settings
app.set('env', process.env.NODE_ENV);
app.set('json spaces', 2);

// middlewares
app.use(helmet()); // security headers
app.use(
  cors({
    credentials: true,
  })
);
app.use(httpResponder);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(mongoSanitize()); // sanitization against NoSQL Injection Attacks
app.use(xss()); // sanitize data
// rateLimiter
app.use(
  '/api/',
  rateLimit({
    windowMs: 25 * 60 * 1000,
    max: 500,
    message: { error: 'Too many requests!, please try again after 25mins' },
  })
);
app.use(morgan('dev'));

app.use(compression());
// Passport middleware
require('./middleware/passport-auth');
app.use(passport.initialize());

// routes
app.use(
  '/api/notifications',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  require('./routes/notificationsRoute'),
  (_err, _req, res, _next) => {
    return res.notAuthorized({ error: 'Unauthorized' });
  }
);
app.use(
  '/api/user',
  require('./routes/userRoute'),
  require('./routes/imagesRoute')
);

// failWithError: https://github.com/jaredhanson/passport/issues/458
app.use(
  '/api/bugs',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  require('./routes/bugsRoute'),
  require('./routes/commentsRoute'),
  (_err, _req, res, _next) => {
    return res.notAuthorized({ error: 'Unauthorized' });
  }
);

// finally handle errors
app.use(errorHandler);
app.use('/api/*', function (req, res) {
  res.notImplemented({ error: 'Not Implemented.' });
});

// Server Side Routing
// If no API routes are hit, send the React app
app.use('/', expressStaticGzip('client/build'));
if (process.env.NODE_ENV === 'production') {
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'), function (
      err
    ) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
}

// https://stackoverflow.com/questions/18856190/use-socket-io-inside-a-express-routes-file/57737798#57737798
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);
const io = require('socket.io').listen(server);

io.on('connection', socket => {
  console.log('NEW CLIENT');
  socket.on('send-notification', () => {
    console.log('NEW NOTIFICATION');
    socket.broadcast.emit('received-notification', {
      message: 'New notifications',
    });
  });
});
