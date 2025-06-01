import logger from "../utils/logger.js";
const errorHandler=(err,req,res,next)=>{
    if (err instanceof Error){
        logger.error(`status code ${err.statusCode}`,{stack:err.stack})
        res.status(err.statusCode||500).json({
            success:false,
            message:err.message|| "Internal server Error"
        })
    }
}
export default errorHandler;