const Side = require('../models/side');
const Category = require('../models/category');
const asyncHandler = require("express-async-handler");
const {body,validationResult} = require("express-validator");

exports.category_list = asyncHandler(async(req, res, next) => {
    const allCategories = await Category.find({}).exec();

    res.render('category/list', {
        title: 'All Categories',
        categories: allCategories,
    });
});

exports.category_Detail = asyncHandler (async (req, res, next) => {
    let thisCategory, allPartsInCategory
    try {
        thisCategory = await Category.findById(req.params.id).populate('items').exec();
        allPartsInCategory = await Side.find({category: req.params.id}).exec();
    }
    catch {
        thisCategory = null;
        allPartsInCategory = [];
    }

    if (thisCategory === null) {
        const err = new Error('Category not found.');
        err.status = 404;
        return next(err);
    }

    res.render('category/detail', {
        title: `Viewing Category: ${thisCategory}`,
        category: thisCategory,
        parts: allPartsInCategory
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render('category/form', {title: 'New Category'});
});

exports.category_create_post = exports.category_create_post = [
    body('category_name', 'Category must have a name.')
      .trim()
      .isLength({ min: 1, max: 32 })
      .escape()
      .withMessage('Category name can not be longer than 32 characters.'),
    
    body('category_description', 'Category must have a description.')
      .trim()
      .isLength({ min: 1, max: 450 })
      .escape()
      .withMessage('Category description cannot be longer than 450 characters.'),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const category = new Category({
        name: req.body.category_name,
        description: req.body.category_description
      });
  
      if (!errors.isEmpty()) {
        res.render('category/form', { 
          title: 'New Category',
          category: category,
          errors: errors.array()
        });
      } else {
        await category.save();
        res.redirect(category.url);
      }
    })
  ];
  
  exports.category_update_get = asyncHandler(async (req, res, next) => {
    let thisCategory;
    try {
      thisCategory = await Category.findById(req.params.id).populate('items').exec();
    } catch {
      thisCategory = null;
    }
  
    if (thisCategory === null) {
      const err = new Error('Category not found.');
      err.status = 404;
      return next(err);
    }
    
    res.render('category/form', { 
      title: 'Update Category',
      category: thisCategory
    });
  });
  
  exports.category_update_post = [
    body('category_name', 'Category must have a name.')
      .trim()
      .isLength({ min: 1, max: 32 })
      .escape()
      .withMessage('Category name can not be longer than 32 characters.'),
    
    body('category_description', 'Category must have a description.')
      .trim()
      .isLength({ min: 1, max: 450 })
      .escape()
      .withMessage('Category description cannot be longer than 450 characters.'),
  
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const category = new Category({
        _id: req.params.id,
        name: req.body.category_name,
        description: req.body.category_description,
      });
  
      if (!errors.isEmpty()) {
        res.render('category/form', { 
          title: 'New Category',
          category: category,
          errors: errors.array()
        });
      } else {
        await Category.findByIdAndUpdate(req.params.id, category);
        res.redirect(category.url);
      }
    })
  ];
  
  exports.category_delete_get = asyncHandler(async (req, res, next) => {
    let thisCategory;
    try {
      thisCategory = await Category.findById(req.params.id).populate('items').exec();
    } catch {
      thisCategory = null;
    }
  
    if (thisCategory === null) {
      const err = new Error('Category not found.');
      err.status = 404;
      return next(err);
    }
  
    res.render('category/delete', {
      title: 'Deleting Category',
      category: thisCategory,
    });
  });
  
  exports.category_delete_post = asyncHandler(async (req, res, next) => {
    let thisCategory;
    try {
      thisCategory = await Category.findById(req.params.id).populate('items').exec();
    } catch {
      thisCategory = null;
    }
  
    if (thisCategory === null) {
      const err = new Error('Category not found.');
      err.status = 404;
      return next(err);
    }
  
    thisCategory.items.forEach(async item => {
      await Part.findByIdAndDelete(item._id)
    });
  
    await Category.findByIdAndDelete(thisCategory._id);
    res.redirect('/categories');
  });
