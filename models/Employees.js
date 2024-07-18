
// Employees.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeesSchema = new Schema({
  name: { type: String, required: true },
  employeesID: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
});

module.exports = mongoose.model('Company', employeesSchema);
