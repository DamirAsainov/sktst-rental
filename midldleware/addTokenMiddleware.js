const { scv } = require("cookie-json-converter");


module.exports = function (req,res,next){
    try{
        req.headers.authorization = "Bearer " + scv(req)['JWToken'];
    }catch (e){
        console.log(e);
    }finally {
        next();
    }
}