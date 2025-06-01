const asyncHandler=(promiseHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(promiseHandler(req,res,next)).catch((err)=>next(err))
    }
}
export default asyncHandler;