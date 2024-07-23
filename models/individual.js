// models/Individual.js
const mongoose = require('mongoose');

const individualSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  foodTaken: {
    type: String,
    default: ''
  },
  ticked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Individual', individualSchema);
