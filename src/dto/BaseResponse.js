/* eslint-disable class-methods-use-this */
class BaseResponse {
  normalResponse(data) {
    return {
      status: 'success',
      data,
    };
  }

  normalMessageResponse(message) {
    return {
      status: 'success',
      message,
    };
  }

  exceptionResponse(message) {
    return {
      status: 'fail',
      message,
    };
  }

  internalErrorResponse(message) {
    return {
      status: 'error',
      message,
    };
  }
}

module.exports = BaseResponse;
