import jwt from "jsonwebtoken";
import { JWT_ADMIN_PASSWORD } from "../config.js";

function adminMiddleware(req,res,next){
    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_ADMIN_PASSWORD);
    if(decode){
        req.userId = decode.id;
        next() 
    }
    else{
        res.status(403).json({
            message : "You are not signed in"
        })
    }
}
export{
    adminMiddleware
}