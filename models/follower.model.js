const { Schema, model, Types } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const schema = new Schema(
  {
    link: { type: String, required: true },
    patition: { type: Number, default: 0 },
    linkIdUser: { type: Types.ObjectId, ref: "Link" },
    linkIdMy: { type: Types.ObjectId, ref: "Link" },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);

module.exports = model("Follower", schema);
