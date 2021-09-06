const colors = require('colors');

colors.setTheme({
    error: ['black','bgRed'],
    sucess: ['black','bgGreen'],
    request: ['black','bgWhite'],
}) 

const printers = {
    errorPrint: (message) =>{
    console.log(colors.error(message));
    },
    successPrint: (message) =>{
        console.log(colors.sucess(message));
    },
    requestPrint: (message) =>{
        console.log(colors.request(message));
    }

}

module.exports = printers;