const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const AuthController = require('../controllers/AuthController');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const log = require('../controllers/log');


router.post('/register',urlencodedParser, (req,res,next) => { 
	log.log({
                level: 'info',
                label: 'routes/signup.js/register',
                request_body: req.body,
		message: 'new user signup request'
        });
	AuthController.register(req,res,next);
});


router.post('/login',urlencodedParser, (req,res,next) => {
	log.log({
                level: 'info',
                label: 'routes/signup.js/login',
                request_body: req.body,
                message: 'User Login request'
        });
        AuthController.login(req,res,next);
});


module.exports = router;
