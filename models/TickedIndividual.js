// // TickedIndividual.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const tickedIndividualSchema = new Schema({
//   name: { type: String, required: true },
//   individualId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
//   foodTaken: { type: String, default: '' },
//   ticked: { type: Boolean, default: true },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('TickedIndividual', tickedIndividualSchema);


// TickedIndividual.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tickedIndividualSchema = new Schema({
  name: { type: String, required: true },
  individualId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  foodTaken: { type: String, default: '' },
  ticked: { type: Boolean, default: true },
  userId: { type: String, required: true }, // Add userId to schema
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TickedIndividual', tickedIndividualSchema);
