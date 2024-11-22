const mongoose = require("mongoose");

const RealtimeSchema = new mongoose.Schema(
  {
    throughput: {
      type: Number,
      required: true,
    },
    rssi: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const RealtimeModel =
  mongoose.models.Realtime || mongoose.model("Realtime", RealtimeSchema);

const getData = async () => {
  return await RealtimeModel.find().sort("-createdAt").lean().exec();
};

const createData = async (data) => {
  const newData = new RealtimeModel(data);
  await newData.save();
  return newData.toObject();
};

module.exports = {
  RealtimeModel,
  getData,
  createData,
};
