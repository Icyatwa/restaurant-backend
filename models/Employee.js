// Employee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  isIndividual: { type: Boolean, default: false },
  foodTaken: { type: String, default: '' },
  ticked: { type: Boolean, default: false },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
