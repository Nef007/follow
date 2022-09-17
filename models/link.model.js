const { Schema, model, Types } = require("mongoose");
const schema = new Schema(
  {
    link: { type: String, required: true },
    level: { type: Number },
    parent: { type: String },
    branch: { type: Number },
    status: { type: String },
    follow: { type: Number },
    type: { type: String },
    userId: { type: Types.ObjectId, ref: "User" },
    petitions: [{ type: Types.ObjectId, ref: "Petition" }],
  },
  { timestamps: true }
);

module.exports = model("Link", schema);
