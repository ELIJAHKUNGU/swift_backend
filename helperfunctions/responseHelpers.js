const apiResponseStatus = {
    success: 200,
    badRequest: 400,
    serverError: 500,
  };
  
  const apiResponseCode = {
    zedSuccess: "SUCCESS",
    payit: "00",
    zedFailed:"FAILED"
  };
  module.exports = class HandleResponse {
    constructor() {}
  
    successResponse(res, response, message) {
      return res.status(apiResponseStatus.success).json({ ...response, status: apiResponseCode?.zedSuccess, message });
    }
    
    badRequestResponse(res,message){
      return res.status(apiResponseStatus.badRequest).json({status:apiResponseCode?.zedFailed, message, })
    }
  
    serverError(res, message){
      return res.status(apiResponseStatus?.serverError).json({status:apiResponseCode?.zedFailed, message: message })
    }
  };