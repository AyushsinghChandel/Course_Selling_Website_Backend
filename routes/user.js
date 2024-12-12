import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { courseModule, purchaseModule, userModule } from "../db.js";
import jwt from "jsonwebtoken";
const router = express.Router;
import { userMiddleware } from "../middleware/user.js";
const userRouter = router();
import { JWT_USER_PASSWORD } from "../config.js";

userRouter.post("/signup", async function(req,res){
    const requireBody = z.object({
        email : z.string().email().min(3).max(100),
        password : z.string().refine(
            (password)=> /[A-Z]/.test(password),{
                message : "Password must contain uppercase"
            }
        ).refine(
            (password)=>/[!@#$%^&*(),.?":{}|<>]/.test(password),{
                message : "Password must contain special Character"
            }
        ),
        firstname : z.string(),
        lastname : z.string()
    })
    const parsedData = requireBody.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message : "Inccorect Formate",
            error : parsedData.error
        })
        return   
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    const hashedPassword = await bcrypt.hash(password,5);
    console.log(hashedPassword);
    try{
        await userModule.create({
            email : email,
            password : hashedPassword,
            firstname : firstname,
            lastname : lastname
        })
        res.json({
            message : "You have successfully signed in"
        })
    }catch(e){
        res.status(403).json({
            message : "There is something wrong please try it later"
        })
    }
})

userRouter.post("/signin",async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModule.findOne({
        email: email
    });
    if (!user) {
        res.json({
            message: "Email doesn't exist",
        });
        return;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password); // Pass retrieved hashedPassword
    if (passwordMatch) {
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
        res.json({
            token: token,
        });
    } else {
        res.status(403).json({
            message: "Invalid Credentials",
        });
    }
})

userRouter.get("/purchases",userMiddleware, async function(req,res){
    const userId = req.userId;
    const purchases = await purchaseModule.find({
        userId
    })
    const courseData = await courseModule.find({
        _id : {$in: purchases.map(x=>x.courseId)}
    }) 
    res.json({
        purchases
    })
})

export {
    userRouter
}