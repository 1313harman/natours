// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIDs = (req, res, next) => {
  console.log(req.body);
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
