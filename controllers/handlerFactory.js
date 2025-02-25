const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIfeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.params);
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
    // console.log('this are the requested parameters :', req.params.id);
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.query);
    let filter = {};
    if (req.params.tourID) filter = { tour: req.params.tourID };
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
