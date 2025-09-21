const mongoose = require("mongoose");
const { Schema } = mongoose;

const authSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ["donor", "ngo"], default: "donor" },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const authModel = mongoose.model("User", authSchema);

module.exports = authModel;