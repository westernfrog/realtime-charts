const mongoose = require("mongoose");

// Define the schema
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

// Create or retrieve the model
const RealtimeModel =
  mongoose.models.Realtime || mongoose.model("Realtime", RealtimeSchema);

// Helper function to fetch data
const getData = async () => {
  return await RealtimeModel.find().sort("-createdAt").lean().exec();
};

// Helper function to create data
const createData = async (data) => {
  const newData = new RealtimeModel(data);
  await newData.save();
  return newData.toObject();
};

// Export the model and helper functions
module.exports = {
  RealtimeModel,
  getData,
  createData,
};
