const express = require('express');
const router = express.Router();

const SideController = require('../controllers/SideController');
const categoryController = require('../controllers/categoryController');
const resetController = require('../controllers/resetController');

router.route('/')
    .get((req,res,next) => {
        res.render('index', {title: 'Index'})
    });

router.route('/category/new')
    .get(categoryController.category_create_get)
    .post(categoryController.category_create_post);
router.route('/category/:id/delete')
    .get(categoryController.category_delete_get)
    .post(categoryController.category_delete_post);
router.route('/category/:id/update')
    .get(categoryController.category_update_get)
    .post(categoryController.category_update_post);

    router.route('/category/:id')
    .get(categoryController.category_detail);
  router.route('/categories')
    .get(categoryController.category_list);
  
  router.route('/side/new')
    .get(sideController.side_create_get)
    .post(sideController.side_create_post);
  router.route('/part/:id/delete')
    .get(sideController.side_delete_get)
    .post(sideController.side_delete_post);
  router.route('/side/:id/update')
    .get(sideController.side_update_get)
    .post(sideController.side_update_post);
  router.route('/side/:id')
    .get(sideController.side_detail);
  router.route('/parts')
    .get(sideController.side_list);
  
  router.route('/reset')
    .get(resetController.reset_get)
    .post(resetController.reset_post);
  
  module.exports = router;