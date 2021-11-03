const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const GroupCtl = require('../controllers/GroupCtl');

//Fetch a Group for the user
//if the logged in user is a member of a group already, return group
//if the logged in user is an admin of a group already, return group
//else create new group with user as admin, return group
router.post('/fetchGroup', (req,res) => {
        //Verify the user token
        jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			GroupCtl.fetchGroup(req,res,auth);
		}//else
	});//jwt
});//route

//Add new user to group
//If current user is a group admin, create new user, and add to the group, return group
//if not an admin, return error
router.post('/addUser', (req,res) => {
	var password = (Math.random()).toString(36).substring(5);
	bcrypt.hash(password, saltRounds, (err, hash) => {
	var user = new User({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: hash,
		deviceId:req.body.deviceId
        });
        //Verify the user token
        jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			GroupCtl.addUser(req,res,auth,user);
		}//else
	});//jwt
	});//bcrypt
});//route



//Fetch a family member's details
router.post('/fetchProfile', (req,res) => {
        //Verify the user token
        jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			GroupCtl.fetchProfile(req,res,auth);
		}//else
        });//jwt
});//route


//Fetch a family member's details
router.post('/updateProfile', (req,res) => {
        //Verify the user token
        jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			GroupCtl.updateProfile(req,res,auth);
                }//else
        });//jwt
});//route


//Delete a family member from group
router.delete('/deleteFromGroup', (req,res) => {
        //Verify the user token
        jwt.verify(req.body.token,process.env.TOKEN_KEY,(err,auth) => {
                if(err){
                        res.send(err.message)
                }else{
			GroupCtl.deleteFromGroup(req,res,auth);
		}//else
	});//jwt
});//router


module.exports = router;
