const mongoose = require("mongoose");
const env = require("../configs");

const startDatabase = async () => {
  try {
    await mongoose.connect(`mongodb+srv://taapn:taapn@cluster0.baq8l.mongodb.net/test`,
     {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Server is connected");
  } catch (error) {
    console.log("There is some error connecting to database", error);
  }
};

module.exports = startDatabase;
