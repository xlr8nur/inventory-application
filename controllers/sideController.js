const Side = require('../models/side');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.part_list = asyncHandler(async (req, res, next) => {
  const allParts = await Side.find({}).exec();

  res.render('part/list', {
    title: 'All Parts',
    parts: allParts
  })
});

exports.part_detail = asyncHandler(async (req, res, next) => {
  let thisPart;
  try {
    thisPart = await Side.findById(req.params.id).populate('category').exec();
  } catch {
    thisPart = null;
  }

  if (thisPart === null) {
    const err = new Error('Part not found.');
    err.status = 404;
    return next(err);
  }

  res.render('part/detail', {
    title: `Viewing Part: ${thisPart.name}`,
    part: thisPart,
  })
});

exports.part_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();
  res.render('part/form', {
    title: 'New Part',
    categories: allCategories
  })
});

exports.part_create_post = [
  body('part_name')
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage('Part name must be between 1 and 64 characters.')
    .escape(),

  body('part_description')
    .trim()
    .isLength({ max: 450 })
    .withMessage('Part description must be between 1 and 450 characters.')
    .escape(),

  body('part_price')
    .toFloat()
    .isFloat({ min: 0.01 })
    .withMessage('Part price must be a decimal number greater than zero.')
    .custom(value => {
      const valueToArray = value.toString().split('');
      if (!valueToArray.includes('.')) return true;
      const decimalPlaces = valueToArray.slice(valueToArray.indexOf('.') + 1);
      if (decimalPlaces.length > 2) return false;
      return true;
    }).withMessage('Part price must have no greater than two decimal places.'),

  body('part_stock')
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Part stock amount must be an integer greater than or equal to zero.'),
    
  body('part_category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Part must have a category selected.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    
    let selectedCategory;
    try { 
      selectedCategory = await Category.findById(req.body.id)._id 
    } catch { 
      selectedCategory = null;
      errors.push({ msg: 'Part must have a valid category.' });
    };

    const part = new Part({
      name: req.body.part_name,
      description: req.body.part_description,
      price: req.body.part_price,
      stock: req.body.part_stock,
      category: req.body.part_category
    });

    if (errors.length > 0) {
      const allCategories = await Category.find({}).exec();
      res.render('part/form', {
        title: 'New Part',
        part: part,
        categories: allCategories,
        errors: errors
      });
    } else {
      await part.save();
      res.redirect(part.url);
    }
  })
]

exports.part_update_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();

  let thisPart;
  try {
    thisPart = await Side.findById(req.params.id).exec();
  } catch {
    thisPart = null;
  }

  if (thisPart === null) {
    const err = new Error('Category not found.');
    err.status = 404;
    return next(err);
  }

  res.render('part/form', {
    title: 'Update Part',
    part: thisPart,
    categories: allCategories
  })
});

exports.part_update_post = [
  body('part_name')
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage('Part name must be between 1 and 64 characters.')
    .escape(),

  body('part_description')
    .trim()
    .isLength({ max: 450 })
    .withMessage('Part description must be no greater than 450 characters.')
    .escape(),

  body('part_price')
    .toFloat()
    .isFloat({ min: 0.01 })
    .withMessage('Part price must be a decimal number greater than zero.')
    .custom(value => {
      const valueToArray = value.toString().split('');
      if (!valueToArray.includes('.')) return true;
      const decimalPlaces = valueToArray.slice(valueToArray.indexOf('.') + 1);
      if (decimalPlaces.length > 2) return false;
      return true;
    }).withMessage('Part price must have no greater than two decimal places.'),

  body('part_stock')
    .trim()
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Part stock amount must be an integer greater than or equal to zero.'),
    
  body('part_category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Part must have a category selected.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    
    let selectedCategory;
    try { 
      selectedCategory = await Category.findById(req.body.id)._id 
    } catch { 
      selectedCategory = null;
      errors.push({ msg: 'Part must have a valid category.' });
    };

    const part = new Part({
      name: req.body.part_name,
      description: req.body.part_description,
      price: req.body.part_price,
      stock: req.body.part_stock,
      category: req.body.part_category,
      _id: req.params.id
    });

    if (errors.length > 0) {
      const allCategories = await Category.find({}).exec();
      res.render('part/form', {
        title: 'Updating Part',
        part: part,
        categories: allCategories,
        errors: errors
      });
    } else {
      const updatedPart = await Side.findByIdAndUpdate(req.params.id, part);
      res.redirect(updatedPart.url);
    }
  })
]

exports.part_delete_get = asyncHandler(async (req, res, next) => {
  let thisPart;
  try {
    thisPart = await Side.findById(req.params.id).populate('category').exec();
  } catch {
    thisPart = null;
  }

  if (thisPart === null) {
    const err = new Error('Part not found.');
    err.status = 404;
    return next(err);
  }

  res.render('part/delete', {
    title: 'Deleting Part',
    part: thisPart
  })
});

exports.part_delete_post = asyncHandler(async (req, res, next) => {
  let thisPart;
  try {
    thisPart = await Side.findById(req.params.id).populate('category').exec();
  } catch {
    thisPart = null;
  }

  if (thisPart === null) {
    const err = new Error('Part not found.');
    err.status = 404;
    return next(err);
  }

  await Part.findByIdAndDelete(req.body.id);

  // remove references to this item within the item's category
  const partCategory = await Category.findOne({ name: thisPart.category.name });
  partCategory.items = await Side.find({ category: partCategory });
  await Category.findByIdAndUpdate(partCategory._id, partCategory);
  
  res.redirect('/parts/');
});