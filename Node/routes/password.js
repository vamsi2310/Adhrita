const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jwt = require('jsonwebtoken');
require('dotenv').config();
const log = require('../controllers/log');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


router.post('/change',urlencodedParser, (req,res,next) =>{
	//verify the token and get user name
        jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
		if(err){
                        res.send(err.message)
                }else{
			bcrypt.hash(req.body.newPassword, saltRounds, (err, hash) => {
				options = { "multi": true, "useFindAndModify":false };
				update = {"$set":{password: hash}};
				User.findOneAndUpdate({name:auth.name}, update, options, (err, docs) =>  {
					if (err){
						log.log({level: 'error',label: 'routes/password.js/change',messgae: err});
                             		}
					else{
						res.status(200).json('Password Changed Sucesfully');
					}
				});//profile.findOneAndUpdate
			});//bcrypt
		}//else
	});//jwt
});//router


module.exports = router;

