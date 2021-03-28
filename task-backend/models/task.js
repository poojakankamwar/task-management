const mongoose = require("mongoose");
// Task schema
const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date
  },
  document: {
    type: String
  },
  remark: {
    type: String
  },
  subtasks: {
    type: Array
  },
  taskStatus: {
    type: String,
    required: false
  }
});


module.exports = mongoose.model("Task", TaskSchema);
