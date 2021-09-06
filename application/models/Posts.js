const db = require('../config/database');


const PostModel = {};


PostModel.create = (title,description, photopath, thumbnail,fk_userId) =>{

    let baseSQL='INSERT INTO posts (title, description, photopath,thumbnail,created,fk_userid) VALUES (?,?,?,?,now(),?)';
    return db.query(baseSQL,[title, description, photopath, thumbnail,fk_userId])
    .then(([results,fields])=>{
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err)=>Promise.reject(err));


}
PostModel.search = (search) =>{
    let baseSQL = "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack FROM posts HAVING haystack like ?;";

    let sqlReadySeachTerm = "%"+search+"%";
   return db.query(baseSQL,[sqlReadySeachTerm])
   .then(([results,fields])=>{
    return Promise.resolve(results);
   })
   .catch((error) => Promise.reject(error));
}
PostModel.getNRecentPosts = (numberOfPosts) =>{
    let baseSQL = 'SELECT id, title, description, thumbnail, created FROM posts ORDER by created DESC LIMIT ?';  //only fetch 8 rows from sql = 8 posts for front page 
   return db.query(baseSQL,[numberOfPosts])
    .then(([results,fields])=>{
        return Promise.resolve(results);
    })
    .catch((error)=>Promise.reject(error));
};
PostModel.getPostById = (postId)=>{
    let baseSQL = "SELECT  u.username, p.title, p.description, p.photopath, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?; ";
   
    //server side validation
    return db.query(baseSQL, [postId])
    .then(([results,fields])=>{
  
    return Promise.resolve(results);

    })
    .catch((error) => Promise.reject(error));
    
    
};

module.exports = PostModel;
