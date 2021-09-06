const { successPrint,errorPrint } = require('../helpers/debug/debugprinters');


const routeProtectors = {};

routeProtectors.userIsLoggedIn =(req, res, next)=>{
//express-recv-request -> mw1 -> mw2->mw3 -> mw4 ->router.export
if(req.session.username){
successPrint('User is logged in');
next();
}else{
errorPrint('User is not logged in');    
req.flash('error','You must be logged in to create a post!');
res.redirect('/login');
next();
}  
};

module.exports=routeProtectors