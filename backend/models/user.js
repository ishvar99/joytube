const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const {
  data: { JWT_SECRET, JWT_EXPIRE },
} = require("../config/keys")
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 3,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      required: [true, "Please provide an email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password should be atleast 6 characters"],
      select: false, //never returns password when we call user
    },
    role: {
      type: Number,
      default: 0,
      // 0 - simple user
      // 2 - admin / superuser
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
)
userSchema.pre("save", async function (next) {
  const user = this
  if (!user.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  next()
})
userSchema.methods.getSignedJwtToken = function () {
  const user = this
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  })
}
userSchema.methods.comparePasswords = async function (plainPassword) {
  const user = this
  return await bcrypt.compare(plainPassword, user.password)
}
userSchema.methods.getResetPasswordToken = function () {
  const user = this
  const resetToken = crypto.randomBytes(20).toString("hex")
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  // Expires in 10 minutes
  return resetToken
}

module.exports = mongoose.model("User", userSchema)
