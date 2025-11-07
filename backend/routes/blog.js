const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { auth } = require('../middleware/auth');

router.get('/', blogController.getAllPosts);
router.get('/my-posts', auth, blogController.getMyPosts);
router.get('/:id', blogController.getPostById);
router.post('/', auth, blogController.createPost);
router.put('/:id', auth, blogController.updatePost);
router.delete('/:id', auth, blogController.deletePost);

module.exports = router;