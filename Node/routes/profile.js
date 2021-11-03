const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ProfileCtl = require('../controllers/ProfileCtl');

//Fetch user details from database to show to user
router.post('/fetch', (req,res,next) => {
	//verify the token and get user name
	jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
		if(err){
			res.send(err.message)
    		}else{
			ProfileCtl.fetch(req,res,auth);
		}//else
	});//jwt
});//route

//Update the user profile
router.post('/update', (req,res,next) => {
	//Verify the user token
	jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			ProfileCtl.update(req,res,auth);
                }//else
        });//jwt
});//route

module.exports = router;
