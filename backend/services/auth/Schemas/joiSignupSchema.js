import Joi from "joi";
const signupSchema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name cannot be empty",
      "any.required": "Name is required"
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required"
    }),
    phoneNumber:Joi.number().required().messages({
        "number.base":"phone number must be a number",
        "any.requires":"phone number is required",
        "number.empty":"phone number cannot be empty"
    }),
    address: Joi.string().required().messages({
      "string.empty": "Address cannot be empty",
      "any.required": "Address is required"
    })
});

const loginSchema=Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email format",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    }),

});
export{signupSchema,loginSchema};


