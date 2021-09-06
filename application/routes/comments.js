var express = require('express');
var router = express.Router();
const {successPrint,errorPrint}= require('../helpers/debug/debugprinters');
const {create} = require('../models/comments');

router.post('/create', async (req, res, next)=>{
 
    if(!req.session.username){
       
       errorPrint("must be logged in to comment");
       res.json({
           code: -1,
           status:"danger",
           message:"must be logged in to comment"
       });
   }else{

   
   let {comment,postId} = req.body;
   let username =req.session.username
   let userId = req.session.userId;

   create(userId,postId,comment)
   .then((wasSuccess) =>{
       if(wasSuccess!=-1){
        //location.reload();
        successPrint(`comment was created for ${username}`);
     
        res.json({
            code: 1,
            status: "success",
            "message": "Created comment",
            comment:comment,
            username: username,
        })
       }else{
        errorPrint('comment was not created');
        res.json({
            code:-1,
            status:"danger",
            "message":"comment was not created",
        })
       }
   })
   .catch(err =>next(err));
}
})


module.exports = router;

