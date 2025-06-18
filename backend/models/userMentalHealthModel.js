import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { ApiError } from "../utils/ApiError.js";
const answerSchema=new mongoose.Schema({
  question:{type:String,required:true},
  selected:{type:String,required:true},
  timeTaken: { type: Number, required: true, min: 0 }
})
const sessionSchema = new mongoose.Schema({
  score:{type:Number,required:true},
  answers: [answerSchema], 
  date: { type: Date, default: Date.now }
});

const UserSchema=new mongoose.Schema({
  userName: { type: String, required: [true, "User name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  address: { type: String, required: [true, "Address is required"] },
  phoneNumber: { type: String, required: [true, "Phone number is required"] },
  sessions: [sessionSchema],
})
UserSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next();
    try{
      const salt =await bcrypt.genSalt(10);
      this.password=await bcrypt.hash(this.password,salt);
      next();
    }catch(error){
      throw new ApiError(500,"Internal server error while hashing password");
    }
  
})
const UserMentalHealth=mongoose.model("UserMentalHealth",UserSchema);
export default UserMentalHealth;