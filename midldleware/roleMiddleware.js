const jwt = require("jsonwebtoken");
// const {secret} = require("../config");
module.exports = function (roles) {
    return function (req,res, next){
        if(req.method === "OPTIONS"){
            next();
        }

        try{
            const token = req.headers.authorization.split(' ')[1];
            if(!token){
                return res.status(403).json({message: "User is not auth"});
            }
            const {roles:userRoles} = jwt.verify(token, process.env.SECRET_KEY)
            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)){
                    hasRole = true;
                }
            })
            if(!hasRole){
                return res.status(403).json({message: "You do not have permission"})
            }
            next();
        } catch (e){
            console.log("User is not auth");
            return res.status(403).json({message: "User is not auth"})
        }
    }
}