const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userSchema = require('./user').schema;
const profileSchema = require('./profile').schema;
const groupSchema = mongoose.Schema({
	owners : [{type: String}],
	members: [{ type: Schema.Types.ObjectId, ref: 'userSchema' }] 
},
	{ timestamps: true }
);

module.exports = mongoose.model('Group',groupSchema);

