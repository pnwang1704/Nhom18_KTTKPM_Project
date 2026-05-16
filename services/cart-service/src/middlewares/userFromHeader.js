// Middleware: parse X-User-Payload header and attach req.user.userId
module.exports = function userFromHeader(req, res, next) {
  const header = req.headers["x-user-payload"] || req.headers["x_user_payload"];
  if (!header) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Missing user payload" });
  }

  try {
    const payload = typeof header === "string" ? JSON.parse(header) : header;
    if (!payload || !payload.userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: Invalid user payload",
        });
    }
    req.user = req.user || {};
    req.user.userId = payload.userId;
    req.user.email = payload.email;
    req.user.role = payload.role;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Bad Request: Invalid X-User-Payload header",
      });
  }
};
