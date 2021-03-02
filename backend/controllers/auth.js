const User = require("../models/user")
const ErrorResponse = require("../utils/errorResponse") //custom error response
const asyncHandler = require("../middlewares/asyncHandler") //avoid using try and catch
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sgMail = require("@sendgrid/mail")
const _ = require("lodash")
const { sendEmail } = require("../utils/sendEmail")
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);
const {
  data: {
    JWT_COOKIE_EXPIRE,
    EMAIL_EXPIRE,
    EMAIL_SECRET,
    SENDGRID_API_KEY,
    CONFIRM_ACCOUNT_TEMPLATE_ID,
    RESET_PASSWORD_TEMPLATE_ID,
    CONFIRM_ACCOUNT,
    RESET_PASSWORD,
  },
} = require("../config/keys")
sgMail.setApiKey(SENDGRID_API_KEY)
templates = {
  confirm_account: CONFIRM_ACCOUNT_TEMPLATE_ID,
  reset_password: RESET_PASSWORD_TEMPLATE_ID,
}
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: false,
  }
  if (process.env.NODE_ENV === "production") {
    options.secure = true
  }
  const filteredUser = _.pick(user, ["_id", "name", "email", "confirmed"])
  res.cookie("token", token, options)
  res.status(statusCode).json({
    success: true,
    user: filteredUser,
  })
}
// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  public

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await User.create({ name, email, password })
  jwt.sign(
    { id: user._id },
    EMAIL_SECRET,
    {
      expiresIn: EMAIL_EXPIRE,
    },
    (err, emailToken) => {
      let url =
        process.env.NODE_ENV === "production"
          ? `${req.protocol}://${req.get(
              "host"
            )}/api/v1/auth/confirmation/${emailToken}`
          : `${req.protocol}://localhost:/api/v1/auth/confirmation/${emailToken}`

      try {
        sendEmail(url, user, CONFIRM_ACCOUNT)
      } catch (err) {
        console.log(err)
      }
    }
  )
  sendTokenResponse(user, 200, res)
})

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  public

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400))
  }
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401))
  }
  const match = await user.comparePasswords(password)
  if (!match) {
    return next(new ErrorResponse("Invalid Credentials", 401))
  }
  sendTokenResponse(user, 200, res)
})

// @desc    Google SignIn 
// @route   POST /api/v1/auth/googlesignin
// @access  public

exports.googleSignIn = asyncHandler(async (req, res, next) => {
  let {tokenId} = req.body;
  console.log(tokenId);
  const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: CLIENT_ID,  
      });
  const payload = ticket?.getPayload();
  if(payload?.email_verified){
    const {email,name}=payload;
    const currentUser = await User.findOne({email});
    if(!currentUser){
      const password=email+EMAIL_SECRET;
      const newUser = await User.create({name,email,password,confirmed:true})
      sendTokenResponse(newUser, 200, res)
    }
    else{
      if(!currentUser.confirmed){
        currentUser.confirmed=true;
        await currentUser.save()
      }
      sendTokenResponse(currentUser,200,res)
    }
  }
  else{
    return next(new ErrorResponse("Unauthorized Access",401))
  }
})


// @desc    Get User
// @route   GET /api/v1/auth/me
// @access  private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.currentUser.id)
  const filteredUser = _.pick(user, ["_id", "name", "email", "confirmed"])
  return res.status(200).json({ success: true, data: filteredUser })
})

// @desc    Logout User
// @route   GET /api/v1/auth/logout
// @access  private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token")
  return res.status(200).json({ success: true })
})

// @desc    Forgot Password
// @route   GET /api/v1/auth/forgotpassword
// @access  public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return next(new ErrorResponse("Email doesn't exist"))
  }
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })
  let url =
    process.env.NODE_ENV === "production"
      ? `${req.protocol}://${req.get("host")}/password_reset/${resetToken}`
      : `${req.protocol}://localhost:3000/password_reset/${resetToken}`
  try {
    await sendEmail(url, user, RESET_PASSWORD)
  } catch (err) {
    user.getResetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse("Failed to send reset password mail", 500))
  }
  return res
    .status(200)
    .json({ success: true, data: `Reset password link send to ${email}` })
})
exports.confirmUser = asyncHandler(async (req, res, next) => {
  const decoded = jwt.verify(req.params.token, EMAIL_SECRET)
  await User.findByIdAndUpdate(decoded.id, { confirmed: true }, { new: true })
  // return res.json({ success: true, msg: "Account verified successfully" })
  return process.env.NODE_ENV === "production"
    ? res.redirect(`${req.protocol}://${req.get("host")}`)
    : res.redirect("http://localhost:3000/")
})

// @desc    RESET PASSWORD
// @route   PUT /api/v1/auth/resetpassword/:token
// @access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user)
    return next(
      new ErrorResponse(
        "It looks like you clicked on an invalid password reset link",
        400
      )
    )
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  res.json({
    success: true,
    data:
      "Password updated successfully! Please login again to continue, redirecting...hold on!",
  })
})
