const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const log = require('../controllers/log');

router.post('/register', (req,res) => { 
	log.log({
                level: 'info',
                label: 'routes/signup.js/register',
                request_body: req.body,
		message: 'new user signup request'
        });
	AuthController.register(req,res);
});

router.post('/login', (req,res) => {
	log.log({
                level: 'info',
                label: 'routes/signup.js/login',
                request_body: req.body,
                message: 'User Login request'
        });
        AuthController.login(req,res);
});

module.exports = router;
