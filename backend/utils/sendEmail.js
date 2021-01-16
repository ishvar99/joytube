const jwt = require("jsonwebtoken")
const sgMail = require("@sendgrid/mail")
const {
  data: { SENDER_EMAIL },
} = require("../../backend/config/keys")
exports.sendEmail = async (url, user, type) => {
  let template_data = {}
  if (type === "confirm_account") {
    template_data = {
      name: user.name,
      confirm_account: url,
    }
  } else if (type === "reset_password") {
    template_data = {
      email: user.email,
      reset_password: url,
    }
  }
  const msg = {
    to: user.email,
    from: SENDER_EMAIL,
    templateId: templates[type],
    dynamic_template_data: template_data,
  }
  await sgMail.send(msg)
  console.log(`Mail sent to ${user.email}`.cyan.bold)
}
