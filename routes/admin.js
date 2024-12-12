import express from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt, { decode } from "jsonwebtoken";
import { adminModule, courseModule } from "../db.js";
const Router = express.Router;
import { adminMiddleware } from "../middleware/admin.js";

const adminRouter = Router();
import { JWT_ADMIN_PASSWORD } from "../config.js";


adminRouter.post("/signup",async function(req,res){
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
        await adminModule.create({
            email : email,
            password : hashedPassword,
            firstname : firstname,
            lastname : lastname
        })
        res.json({
            message : "You have successfully signed in"
        })
    }
    catch(e){
        res.status(403).json({
            message: "there is something wrong please try is later"
        })
        return
    }
})
adminRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await adminModule.findOne({
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
        const token = jwt.sign({ id: user._id }, JWT_ADMIN_PASSWORD);
        res.json({
            token: token,
        });
    } else {
        res.status(403).json({
            message: "Invalid Credentials",
        });
    }
});

adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const { tittle , description , imageUrl , price } = req.body;
    const course = await courseModule.create({
        tittle,
        description,
        imageUrl,
        price,
        creatorId : adminId
    })
    res.json({
        message : "Course created",
        courseId : course._id
    })
})

adminRouter.put("/courseupdate",adminMiddleware , async function(req,res){
    adminId = req.userId;
    const { tittle , description , imageUrl , price , courseId } = req.body;

    const course = await courseModule.updateOne({
        _id : courseId,
        creatorId : adminId
    },{
        tittle,
        description,
        imageUrl,
        price
    })

    res.json({
        message : "Course is updated",
        courseId : course._id
    })
})

adminRouter.get("/course/bulk",adminMiddleware , async function(req,res){
    const adminId = req.userId;
    const courses = await courseModule.find({
        creatorId : adminId
    });
    res.json({
        message : "course updated",
        courses
    })
})

export {
    adminRouter
}