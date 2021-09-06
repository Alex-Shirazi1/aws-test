var express = require('express');
var router = express.Router();
var isLoggedIn =require('../middleware/routeprotectors').userIsLoggedIn;
const  {getRecentPosts,getPostById,getCommentsByPostId}= require('../middleware/postsmiddleware')
const db = require('../config/database');

/* GET home page. */

router.get('/',getRecentPosts,function(req, res, next) {
  res.render('index',{title: 'Home'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title: 'Login'});
});
router.get('/imagepost', function(req, res, next) {
  res.render('imagepost',{title: 'Image Post'});
});
router.get('/registration', function(req, res, next) {
  res.render('registration',{title: 'Register'});
});
router.get('/submitted', function(req, res, next) {
  res.render('submitted',{title: 'submitted'});
});
router.use('/postImage',isLoggedIn);
router.get('/postimage', function(req, res, next) {
  res.render('postimage',{title: 'Post an Image'});
});
router.get('/post/:id(\\d+)',getPostById,getCommentsByPostId,(req, res, next)=>{  //getCommentsForPostId,
 
res.render('imagepost', {title: `Post ${req.params.id}`});


});

module.exports = router;
