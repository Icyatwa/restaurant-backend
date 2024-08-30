// TickedRecord.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tickedRecordSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, default: null },
  isIndividual: { type: Boolean, required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  foodTaken: { type: String, default: '' },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('TickedRecord', tickedRecordSchema);
