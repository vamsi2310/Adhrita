const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true, unique: true,dropDups: true},
	mobile: { type: Number, required: true},
        email: { type: String, required: true},
        password: { type: String, required: true},
	deviceId: { type:String}
	},
  { timestamps: true }
);

module.exports = mongoose.model('User',userSchema);

