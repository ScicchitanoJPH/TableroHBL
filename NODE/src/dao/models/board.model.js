const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const boardsCollection = "boards";

const boardsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    devices: [
      {
        hbl_id: {
          type: String,
          required: true,
          unique: true,
        },
      },
    ],
  },
  { timestamps: true }
);

boardsSchema.pre("find", function (next) {
  this.populate("devices.hbl_id");
  next();
});

boardsSchema.pre("findOne", function (next) {
  this.populate("devices.hbl_id");
  next();
});

boardsSchema.pre("findOneAndUpdate", function (next) {
  this.populate("devices.hbl_id");
  next();
});

boardsSchema.plugin(mongoosePaginate);

const boardModel = mongoose.model(boardsCollection, boardsSchema);

module.exports = {
  boardModel,
};
