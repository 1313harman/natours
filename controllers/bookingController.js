const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModels');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user?.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100, // Stripe requires amount in cents
        },
        quantity: 1,
      },
    ],
  });

  // 3) Send session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only Temporary, beacuse it's USECURE: everymake booking without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

/***
const createBookingCheckout =async session =>{
  const tour =  session.client_reference_id
  const user = (await User.findOne({email:session.customer_email})).id
  const price= session.line_items[0].unit_amount / 100
  await Booking.create({ tour, user, price });
}

remove the upper function from viewRoutes and this controller also. and set success_url= ${req.protocol}://${req.get('host')}/my-tour, and get webhooks secret key from stripe website and paste it in config.env file
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature']
  let event
  try{
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRETKEY)
  }
  catch{
    return res.status(400).send('Webhook error',{err.message})
  }
  if(event.type==='checkout.session.completed'){
    createBookingCheckout(event.data.object)
  }
  res.status(200).json({received:true})
};
***/
exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
