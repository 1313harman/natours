import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(
  'pk_test_51QrZRMCXYGjdbEFWWwA9sFpoSOvYLvX8l76lFED6FoMOC2kTQoAUWNERwcxNCXQTRHoJPwEjf7o4oJABDUWTW7LE00sFr5rZd3',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripePromise.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
