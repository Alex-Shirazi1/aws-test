function validate(){
const username= document.getElementById("username").value;
const password= document.getElementById("pwd").value;
const email= document.getElementById("email").value;
const cpassword= document.getElementById("cpwd").value;
const ageCheck = document.getElementById("agree");
const terms= document.getElementById("agree2");

var userError = document.getElementById("userError");
var emailError = document.getElementById("emailError");
var pwdError = document.getElementById("pwdError");
var cpwdError = document.getElementById("cpwdError");
var ageError = document.getElementById("ageError");
var agreeError = document.getElementById("agreeError");


var userErr = false;
var emailErr = false;
var pwdErr = false;
var cpwdErr = false;
var ageErr = false;
var termsErr =false;

const validEmail =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)?$/;
const letters = /^[a-zA-Z]+$/;
var passwordRequirements = /^(?=.*\d)(?=.*[!@#+$%/^&-*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
var firstLetterUser =username.charAt(0);

//username logic
if(username ===''){
userError.innerHTML = "<label>Username is required</label>";
userErr=true;
}
if(username.length<3&&username.length>0){
    userError.innerHTML = "<label>Username too short</label>";
   userErr=true;


}
if(username.length>20){
 userError.innerHTML = "<label>Username too long</label>";
 userErr=true;
}
if(!(firstLetterUser.match(letters))&&username.length>0){
    userError.innerHTML="<label>Username must start with a letter</label>";
    userErr=true;
    }

if(username.length<20&&username.length>=3&&firstLetterUser.match(letters)){
    userErr=false;
    userError.innerHTML=null;
}


//email logic
if(email ==''){
    emailError.innerHTML ="<label>Email is required</label>";
   emailErr=true;

}else if(email.length>0&&email.match(validEmail)==false){
emailError.innerHTML="<label>Email is invalid</label>";
emailErr=true;
}
else if (email.match(validEmail)){
        emailError.innerHTML=null;
        emailErr=false;
    }
if(email.length>254){
    emailError.innerHTML = "<label>Email is way to long</label>";
    emailErr=true;
}
if(email.length<4){
    emailError.innerHTML ="<label>email too short</label>";
    emailErr=true;
}
if(email.length==0){
    emailError.innerHTML="<label>email required</label>";
    emailErr=true;
}




//password logic

if(password ===''||password==null){
pwdError.innerHTML = "<label>password is required</label>";
pwdErr=true;
}

 
 if(password.length>0&&passwordRequirements.test(password)==false){
pwdError.innerHTML="password must have at least 1 upper case letter, 1 lower case letter, 1 number, and 1 special character"
pwdErr=true;
 }
 if(password.length<8&&password.length>0){
    pwdError.innerHTML = "<label>password is too short</label>";
    pwdErr=true;
    
    }
    if(password.length>20){
    pwdError.innerHTML = "<label>password is too long</label>";
    pwdErr=true;
     }
if(password.length<20&& password.length>=8&&passwordRequirements.test(password)){
    pwdError.innerHTML=null;
    pwdErr=false;
}
//Confirm password logic
 if(cpassword===''||cpassword==null){
    cpwdError.innerHTML = "<label>Be sure to confirm password</label>";
    cpwdErr=true;
}else if((password==cpassword)){
cpwdError.innerHTML = null;
cpwdErr=false;

}
if (password!=cpassword){
    cpwdError.innerHTML ="<label>password and confirm password doesnt match</label>";
    cpwdErr=true;
}
//check boxes logic
if(ageCheck.checked==false){
    ageError.innerHTML = "<label>please confirm that you are 13 years or older</label>";
ageErr=true;
}else if(ageCheck.checked==true){
    ageError.innerHTML = null;
ageErr=false;
}
if(terms.checked==false){
agreeError.innerHTML="<label>please agree with the terms. If you need to read the terms, feel free to click the link</label>";
termsErr=true;
}else if(terms.checked==true){
    termsErr=false;
   agreeError.innerHTML=null;
}
//determines whether or not to submit form
if(userErr==false&&emailErr==false&&pwdErr==false&&cpwdErr==false&&ageErr==false&&termsErr==false){
    return true;
}
return false;
}



    
    