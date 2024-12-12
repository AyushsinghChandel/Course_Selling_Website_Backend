import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname: String
})

const adminSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname: String
})

const courseSchema = new Schema({
    tittle : String,
    description : String,
    price: Number,
    imageUrl: String,
    creatorId : ObjectId
})

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
})

const userModule = mongoose.model("user",userSchema);
const adminModule = mongoose.model("admin",adminSchema);
const courseModule = mongoose.model("course",courseSchema);
const purchaseModule = mongoose.model("purchase",purchaseSchema);

export{
    userModule,
    adminModule,
    courseModule,
    purchaseModule
}