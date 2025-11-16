module.exports = (schema, source = "body") => (req, res, next) => {
  const data = req[source];
  const { error, value } = schema.validate(data);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  req[source] = value; // sanitized & validated
  next();
};
