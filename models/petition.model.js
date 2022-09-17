const { Schema, model, Types } = require("mongoose");
const schema = new Schema(
  {
    comment: { type: String, required: true },
    linkIdUser: { type: Types.ObjectId, ref: "Link" },
    linkIdMy: { type: Types.ObjectId, ref: "Link" },
  },
  { timestamps: true }
);

module.exports = model("Petition", schema);
