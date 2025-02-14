const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//1) GLOBAL MIDDLEWARES
// SECURITY HTTP
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://maps.googleapis.com',
          'https://maps.gstatic.com',
          'https://js.stripe.com',
          "'unsafe-inline'",
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'], // ✅ Allow Stripe framing
        connectSrc: [
          "'self'",
          'ws://127.0.0.1:54272',
          'https://maps.googleapis.com',
          'https://js.stripe.com',
        ],
        imgSrc: ["'self'", 'data:', 'https://maps.gstatic.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
  }),
);
// CHECKING THE CURRENT MODE development || production
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// SET LIMIT OF REQUEST ON SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// BODY PARSER, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization AGAINST ATTACK FROM NOSql Querry Injection
app.use(mongoSanitize());

// Data sanitization AGAINST ATTACK HTML script
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// TEST MIDDLEWARE
app.use((req, res, next) => {
  console.log('Hello from the middleware 😁');
  next();
});
// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString().slice(0, 10);
  // console.log(req.cookies);
  next();
});
// SETTING ROUTINGS
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

// CHECK CORRECT URL
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} in server!!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
