const mongoose = require('mongoose');
const profileSchema = mongoose.Schema({
	name: { type: String},
	firstName: { type: String},
	lastName:{ type: String},
	mobile: { type: Number},
        email: { type: String},
	gender: {type: String},
	qualification: {type: String},
	specialization: {type: String},
	hospital: {type: String},
	experience: {type: String},
        consultaionTiming: {type: String},
	fees: {type: String},
	address: {type: String},
	zip: {type: String},
	counry: {type: String},
	city: {type: String},
	state: {type: String}
	},
  { timestamps: true }
);

module.exports = mongoose.model('Profile',profileSchema);

