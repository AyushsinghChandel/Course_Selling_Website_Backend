import 'dotenv/config'

import express from "express";
import mongoose from "mongoose"; 
import { userRouter } from "./routes/user.js";
import { courseRouter } from "./routes/course.js";
import { adminRouter } from "./routes/admin.js";

const app = express();
app.use(express.json());

app.use("/user",userRouter)
app.use("/course",courseRouter)
app.use("/admin",adminRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("Listening to the port 3000");
}
main();