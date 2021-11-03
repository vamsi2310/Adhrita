const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });


router.post('/', urlencodedParser, (req,res,next) => {
	const user = new User({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		previllege: req.body.previllege
	});
	user
	.save()
	.then(result => {
		console.log("User added to DB "+result);
		res.status(200).json({result});
	})
	.catch(err=> {
		console.log(err);
		res.status(500).json({error: err});
	});
	
//        res.send('result of q1');	
});

module.exports = router;
