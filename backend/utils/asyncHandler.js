// Wraps an async route handler so any thrown error / rejected promise
// is passed to Express's error-handling middleware instead of crashing
// the server or hanging the request.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
