const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const log = require('./log');

const register = (req,res,next) => {
	console.log(req.body);
bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
	var user = new User({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
		email: req.body.email,
		mobile: req.body.mobile,
		password: hash
	});
	User.findOne({$or:[{name:req.body.name},{email:req.body.name},{phone:req.body.name}]})
        .then(userres => {
                if(userres){
			log.log({
		                level: 'info',
                		label: 'Authenticate.js/register',
                		messgae: 'User Already Exists!'
        		});

			log.info(req.body)
			return res.json({message: 'User Already Exists!'});
                }
		else(
			user.save()
        		.then(result => {
                		log.log({
                                level: 'info',
                                label: 'Authenticate.js/register',
                                messgae: 'User signup Succesful !'
                        })
				res.status(200).json({result});
        		})
        		.catch(error => {
                		res.status(500).json({error});
		                log.log({
                                	level: 'info',
                                	label: 'Authenticate.js/register',
                                	messgae: error
                        	})
        		})
		);
	});
});
}



const login = (req,res,next) => {
	console.log(req.body.body);
        name: req.body.name;
        password:req.body.password;
        User.findOne({$or:[{name:req.body.name},{email:req.body.name},{phone:req.body.name}]})
        .then(user => {
                if(user){
			bcrypt.compare(req.body.password, user.password,function(err, result) {
				if(result == true){
					let token = jwt.sign({name:user.name}, process.env.TOKEN_KEY,{expiresIn: '1h',});
					log.log({
                		                level: 'info',
                                		label: 'Authenticate.js/login',
		                                messgae: 'Login Succesful'
                		        })
					res.json({
						message: 'Login Succesful',
						user,
						token
					});
					
				}
				else{res.json({message:'Invalid Password'});};
			});
			
                }
		else{res.json({message: 'No user Found!'});};

	})
	.catch(error => {
		res.status(500).json({error});
		log.log({
			level: 'info',
                        label: 'Authenticate.js/login',
                        messgae: error
                })

	});
};



module.exports = {register,login};
