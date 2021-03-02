exports.data = {
  mongoProductionURI: process.env.mongoProduction,
  mongoDevelopmentURI: process.env.mongoDevelopment,
  DEV_PORT: process.env.DEV_PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  EMAIL_EXPIRE: process.env.EMAIL_EXPIRE,
  EMAIL_SECRET: process.env.EMAIL_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  CONFIRM_ACCOUNT_TEMPLATE_ID: process.env.CONFIRM_ACCOUNT_TEMPLATE_ID,
  RESET_PASSWORD_TEMPLATE_ID: process.env.RESET_PASSWORD_TEMPLATE_ID,
  CONFIRM_ACCOUNT: process.env.CONFIRM_ACCOUNT,
  RESET_PASSWORD: process.env.RESET_PASSWORD,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID
}
