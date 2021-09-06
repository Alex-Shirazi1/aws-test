const {getNRecentPosts,getPostById} = require('../models/Posts')
const postMiddlware = {}
const {getCommentsForPostId} = require('../models/Comments')
postMiddlware.getRecentPosts = async (req, res, next)=>{
 try{
    let results = await getNRecentPosts(8);
    res.locals.results = results;
    if(results.length==0){
        req.flash('error','There are no Posts Created!');
    }
    next();
 }catch(e){
     next(e);
 }
}
postMiddlware.getPostById =async(req, res, next)=>{
    try{
        let postId = req.params.id;
        let results = await getPostById(postId);
        if(results && results.length){
            res.locals.currentPost = results[0];    
            next();
        }else{
            req.flash('error','This is not the post you were looking for');
            res.redirect('/');
        }
    }catch(e){
        next(e);
    }
}

postMiddlware.getCommentsByPostId = async function(req, res, next){
    let postId = req.params.id;
    try{
        let results = await getCommentsForPostId(postId);
        res.locals.currentPost.comments=results;
        next();
    }catch(e){
        next(e);
    }
}
module.exports = postMiddlware;
