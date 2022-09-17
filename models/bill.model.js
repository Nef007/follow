const { Schema, model, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const schema = new Schema(
  {
    qiwiId: { type: String, required: true },
    value: { type: String, required: true },
    status: { type: String },
    expirationDateTime: { type: String },
    payUrl: { type: String },
    userId: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);

module.exports = model("Bill", schema);
