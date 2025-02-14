const express = require('express');
const bookingContoller = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourID', bookingContoller.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingContoller.getAllBookings)
  .post(bookingContoller.createBooking);

router
  .route('/:id')
  .get(bookingContoller.getBooking)
  .patch(bookingContoller.updateBooking)
  .delete(bookingContoller.deleteBooking);
module.exports = router;
