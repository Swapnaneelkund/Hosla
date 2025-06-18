import UserMentalHealth from "../../../models/userMentalHealthModel.js";
import { apiResponce } from "../../../utils/ApiResponseHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import {signupSchema} from "../Schemas/joiSignupSchema.js";
import jwt from "jsonwebtoken";

const signupController= async (req,res)=>{
   const {name,email,password,phoneNumber,address}=req.body;
  try{
    await signupSchema.validateAsync({name,email,password,address,phoneNumber});
  }catch(error){
    const responce=apiResponce(400,null,error.message);
    return res.status(responce.statusCode).json(responce);
  }
  try {
    const user=await UserMentalHealth.findOne({email:email})
    if(user){
      const responce=apiResponce(400,null,"User already exists please login");
      return res.status(responce.statusCode).json(responce);
    }
  } catch (error) {
    const responce=apiResponce(400,null,"Internal server error");
    res.status(responce.statusCode).json(responce);
    throw new ApiError(500,"Internal server error");
  }
  try{
    const newUser=await UserMentalHealth.create({
      userName:name,
      email,
      password,
      phoneNumber,
      address,

    })
    const token = jwt.sign(
      { email: newUser.email }, // Payload
      process.env.JWT_SECRET, // Secret key from environment variables
      
      // Token expiration time
    );
    const responce=apiResponce(201,null,"User created successfully");    

    // Set token in a cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevent JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
      sameSite: "Strict", // Helps mitigate CSRF attacks
      maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months
    }).status(responce.statusCode).json(responce);
  }catch{
    throw new ApiError(500,"Internal server error ");
  }

}
export default signupController;