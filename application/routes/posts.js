var express = require('express');
var router = express.Router();
const db = require('../config/database');
const { successPrint,errorPrint } = require('../helpers/debug/debugprinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostError');
var PostModel = require('../models/Posts')


var storage = multer.diskStorage({
    destination: (req, file,cb) =>{
        cb(null, "public/images/uploads");
    },
    filename: (req, file,cb) =>{
        let fileExt=file.mimetype.split('/')[1];
        let randomName=crypto.randomBytes(22).toString("hex");
        cb(null,`${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createPost',uploader.single("UploadImage"), (req, res, next)=>{
    let fileUploaded=req.file.path;
    let fileAsThumbnail= `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail=req.file.destination+"/"+fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;  

   
    if(title===""||description===""||fk_userId<0){
        throw new PostError(
            "PostData Rejected","/postimage",200);
    };


    sharp(fileUploaded).resize(200).toFile(destinationOfThumbnail)
    .then(()=>{
        return PostModel.create(title, description,fileUploaded,destinationOfThumbnail,fk_userId);
        

    })
    .then((postWasCreated)=>{
        if(postWasCreated){
            req.flash('success','your post was successfully created');
            res.redirect('/');
        }else{
            throw new PostError('Post could not be created','postImage',200);    
        }
    })
    .catch((error)=>{
        if(error instanceof PostError){
            errorPrint(error.getMessage());
            req.flash('error',error.getMessage());
            res.status(error.getStatus());
            res.redirect(error.getRedirectUrl());
        }else{
            next(error);
        }
    })
});


router.get('/search', async(req, res, next)=>{
    try{
    let searchTerm = req.query.search;
   
if(!searchTerm){
    res.send({
    resultsStatus: "info",
    message: "No Search term given",
    results: [],
    });
}else{
    let results = await PostModel.search(searchTerm)
        if(results.length){
            res.send({
                resultsStatus: "info",
                message: `${results.length} results found`,
                results: results,
            });
        }else{
           let results = await PostModel.getNRecentPosts(8);

                res.send({
                    message: "No results were found for your search but here are the 8 most recent posts",
                    results: results,
                });
            
        }
    }
}catch(error){
    next(error);
}
    
});
module.exports = router;