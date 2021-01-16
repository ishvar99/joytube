const mongoose = require("mongoose")
const {
  data: { mongoDevelopmentURI, mongoProductionURI },
} = require("../config/keys")
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.mongoProductionURI || mongoDevelopmentURI,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    )
    console.log(`MongoDB Connected ${conn.connection.host}`.cyan.bold.underline)
  } catch (err) {
    console.log("MongoDB Connection Failed".red.bold.underline)
    console.log(`${err}`.red)
  }
}
module.exports = connectDB
