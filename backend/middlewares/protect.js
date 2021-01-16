const asyncHandler = require("./asyncHandler")
const User = require("../models/user")
const ErrorResponse = require("../utils/errorResponse")
const jwt = require("jsonwebtoken")
const {
  data: { JWT_SECRET },
} = require("../config/keys")
exports.isLoggedin = asyncHandler(async (req, res, next) => {
  let token = req.cookies["token"]
  if (!token) {
    return next(new ErrorResponse("Authentication Failed!", 401))
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.currentUser = await User.findById(decoded.id)
    next()
  } catch (error) {
    return next(new ErrorResponse("Authentication Failed!", 401))
  }
})

exports.isAuthenticated = (req, res, next) => {
  let checkAuth =
    req.currentUser && req.foundUser && req.foundUser.id == req.currentUser.id

  if (!checkAuth) {
    return res.status(403).json({
      error: "Authentication Failed",
    })
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (req.foundUser.role === 0) {
    return res.status(403).json({
      error: "Access Denied!",
    })
  }
  next()
}
