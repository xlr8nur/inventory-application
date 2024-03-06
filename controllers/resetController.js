const reset = require('../populatedb');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.reset_get = asyncHandler(async (req, res, next) => {
  res.render('reset', {
    title: 'Reset Inventory',
    wrongCode: false
  });
});

exports.reset_post = [
  body('passcode')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (req.body.passcode !== 'strawberry') {
      res.render('reset', {
        title: 'Reset Inventory',
        wrongCode: true
      });
    } else {
      await reset().catch(e => console.log(e));
      res.redirect('/');
    }
  })
];

