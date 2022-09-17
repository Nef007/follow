const { Schema, model, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    sex: { type: String, required: true },
    uid: { type: String, required: true },
    birthday: { type: Date, required: true },
    avatar: { type: String },
    balance: { type: Number, default: 100 },
    countRef: { type: Number, default: 0 },
    referrer: { type: String },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);

module.exports = model("User", schema);
