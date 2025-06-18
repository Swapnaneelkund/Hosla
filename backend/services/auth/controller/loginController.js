import UserMentalHealth from "../../../models/userMentalHealthModel.js";
import { apiResponce } from "../../../utils/ApiResponseHandler.js";
import { ApiError } from "../../../utils/ApiError.js";
import { loginSchema } from "../Schemas/joiSignupSchema.js";
import bcrypt from "bcrypt";
const loginController =async(req,res)=>{
    const {email,password}=req.body;
    try{
        await loginSchema.validateAsync({email,password});

    }catch(error){
        const responce=apiResponce(400,null,error.message);{
            return res.status(responce.statusCode).json(responce);
        }
    }
    try{
        const User= await UserMentalHealth.findOne({email:email});
        if(!User){
            const responce=apiResponce(400,null,"User does not exists please sign up");
            return res.status(responce.statusCode).json(responce);
        }
        bcrypt.compare(password, User.password, function(err, result) {
            if(err){
                throw new ApiError(500,"Internal server error");

            }
            if(!result){
                const responce=apiResponce(400,null,"Invalid credentials");
                return res.status(responce.statusCode).json(responce);
            }
            const token=JsonWebTokenError.sign(
                {email:User.email},
                process.env.jwt_SECRET,
                {expiresIn:"6months"}

            )
            res.cookie("authToken",token,{
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
                sameSite: "Strict", // Helps mitigate CSRF attacks
                maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months
            }).status(200).json(apiResponce(200,null,"login successfull"))
        });

    }catch(error){
      throw new ApiError(500,"Internal server error ");
    }
}
export default loginController;