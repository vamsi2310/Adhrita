const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Profile = require('../models/profile');
const AuthController = require('../controllers/AuthController');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require('jsonwebtoken');
require('dotenv').config();
const log = require('../controllers/log');

//Fetch user details from database to show to user
router.get('/fetch',urlencodedParser, (req,res,next) => { 
	//verify the token and get user name
	jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,result) => {
		if(err){
			res.send(err.message)
    		}else{
			//If no error -> fetch the profile and respond.
		log.log({
	                level: 'info',
        	        label: 'routes/profile.js/fetch',
                	user: result.name,
			messgae: 'token verified, fetching profile'
        	});

		Profile.findOne({name:result.name})
		.then(profile => {
			if(profile){ 
				res.status(200);
				res.json({
                			profile
        			});
			}
			else{
				res.status(403);
                        	res.json({
					message:'profile not found'
                        	});
			}
		})
		.catch(error => {
	                res.status(500).json({error});
                	console.log(error);
        	});
		}
	});
});


//Update the user profile
router.post('/update',urlencodedParser, (req,res,next) => {
	
	//Verify the user token
	jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			//If token is verified, check if a user profile already exists
                Profile.findOne({name:auth.name})
                .then(profile => {
			//If profile is found in DB, update with the details recieved.
			if(profile){
				options = { "multi": true };
				update = {
					"$set": {
                                		firstName: req.body.firstName,
		                                lastName: req.body.lastName,
		                                mobile:req.body.mobile,
		                                email:req.body.email,
		                                gender:req.body.gender,
		                                qualification:req.body.qualification,
		                                specialization:req.body.specialization,
                		                hospital:req.body.hospital,
                                		experience:req.body.experience,
		                                consultaionTiming:req.body.consultaionTiming,
                		                fees:req.body.fees,
                                		address:req.body.address,
		                                zip:req.body.zip,
		                                counry:req.body.counry,
                		                city:req.body.city,
                                		state:req.body.state

					}
				};
				Profile.findOneAndUpdate({name:auth.name}, update, options, (err, docs) =>  {
    					if (err){
					        console.log('error occured1')
    					}
    					else{
						res.status(200).json({update});
					    }
				})
				.catch(error => {
					res.status(500).json({error});
				});

                        	
			}
			//if user is not found in DB, insert a new profile entry in DB.
                        else{
				var profile = new Profile({
                                name: auth.name,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                mobile:req.body.mobile,
                                email:req.body.email,
                                gender:req.body.gender,
                                qualification:req.body.qualification,
                                specialization:req.body.specialization,
                                hospital:req.body.hospital,
                                experience:req.body.experience,
                                consultaionTiming:req.body.consultaionTiming,
                                fees:req.body.fees,
                                address:req.body.address,
                                zip:req.body.zip,
                                counry:req.body.counry,
                                city:req.body.city,
                                state:req.body.state
                        });

				profile.save()
				.then(result => {
					res.status(200).json({result});
				})
				.catch(error => {
					res.status(500).json({message: 'unable to save new user profile'});
				});
			}
                })
                .catch(error => {
                        res.status(500).json({error});
                        console.log(error);
                });
                }
        });
	
});



module.exports = router;
