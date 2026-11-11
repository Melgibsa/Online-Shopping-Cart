function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.name === "ZodError") {
    return res.status(400).json({
      message: error.issues.map((issue) => issue.message),
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }

  const status = Number.isInteger(error?.status) ? error.status : 500;
  if (status >= 500) {
    console.error("Request failed:", error);
    return res.status(500).json({ message: "An unexpected server error occurred." });
  }

  return res.status(status).json({ message: error.message || "Request failed." });
}

module.exports = { errorHandler };
