// // Company.js
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const companySchema = new Schema({
//   name: { type: String, required: true },
//   employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
// });

// module.exports = mongoose.model('Company', companySchema);

// Company.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  name: { type: String, required: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Company', companySchema);
