import express from "express";
const router = express.Router;
import { userMiddleware } from "../middleware/user.js";
import { purchaseModule , courseModule } from "../db.js";
const courseRouter = router();

courseRouter.post("/purchase",userMiddleware , async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModule.create({
        userId,
        courseId
    })
    res.json({
        message: "YOu have successfully bought the course"
    })
})

courseRouter.get("/preview", async function(req,res){
    const course = await courseModule.find({});
    res.json({
        course
    })
})

export{
    courseRouter
}