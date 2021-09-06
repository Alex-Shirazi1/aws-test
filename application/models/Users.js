const db = require('../config/database');
const bcrypt = require('bcrypt');
const UserModel ={};

UserModel.create = (username,email, password) => {
return bcrypt.hash(password,15)
.then((hashedPassword)=>{

    let baseSql = 'INSERT INTO users (username, email, password, CREATED) VALUES (?,?,?,now());';

    return db.query(baseSql,[username,email,hashedPassword]);

})
.then(([results,fields])=>{
    if(results&&results.affectedRows){
        return Promise.resolve(results.insertId);
    }else{
        return Promise.resolve(-1);
    }
})
.catch((error)=> Promise.reject(error));
}
UserModel.usernameExists = (username)=>{
return db.query("SELECT * FROM users WHERE username=?",[username])
.then(([results,fields]) =>{
    return Promise.resolve(!(results && results.length==0));
})
.catch((error) => Promise.reject(error));

}
UserModel.emailExists = (email)=>{
    return db.query("SELECT * FROM users WHERE email=?",[email])
    .then(([results,fields]) =>{
        return Promise.resolve(!(results && results.length==0));
    })
    .catch((error) => Promise.reject(error));
    
}
UserModel.authenticate = (username, password)=>{
    let userId;
    let basesql = "SELECT id,username, password FROM users WHERE username=?;";
    
    return db.query(basesql,[username])
    .then(([results,fields])=>{
        if(results && results.length==1){
            userId = results[0].id;
            return bcrypt.compare(password,results[0].password);
        }else{
            return Promise.reject(-1);
        }



    })
    .then((passwordsMatch)=>{
        if(passwordsMatch){
           return Promise.resolve(userId);
        }else{
            return Promise.resolve(-1);
        }
    })
    .catch((err)=>Promise.reject(err));
};
module.exports=UserModel;