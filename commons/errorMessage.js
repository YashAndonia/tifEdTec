const errorMessage = (res, message = "Something went wrong") => {
  res.status(400).json({
    status: false,
    errors: [{ message: message }],
  });
};

module.exports = errorMessage;
