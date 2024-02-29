const { scv } = require("cookie-json-converter");


module.exports = function (req,res,next){
    try{
        req.headers.authorization = "Bearer " + scv(req)['JWToken'];
    }catch (e){
        console.log("token is not exist");
    }finally {
        next();
    }
}