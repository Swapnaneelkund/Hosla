import logger from "../utils/logger.js";
const errorHandler=(err,req,res,next)=>{
    const status = err.statusCode || 500;
    const payload = {
        success:false,
        message: status===500 ? 'Internal server error' : err.message,
        code: err.code || undefined,
        errors: err.errors || undefined,
        requestId: req.id
    };
    logger.error(`ERR ${req.id} ${status} ${err.message}`,{stack:err.stack});
    res.status(status).json(payload);
}
export default errorHandler;