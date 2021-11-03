// Set up Express, Http, Https with self signed certificates, dotenv
const fs = require('fs');
const bodyParser  = require('body-parser');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('/home/ubuntu/Backend/keys/privateKey.key', 'utf8');
const certificate = fs.readFileSync('/home/ubuntu/Backend/keys/certificate.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const express = require('express')
const app = express();
require('dotenv').config();
const log = require('./controllers/log');
const winston = require('winston');


//CreateServer
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use(function(req, res, next) {
//	req.header("Content-Type", "application/json");
	res.setHeader("Content-Type", "application/json");
	next();
});

//Set up Mongoose Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI+process.env.DB_USER, {useNewUrlParser: true, useUnifiedTopology: true}, () => 
	log.info('connected to DB')
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Default Route to test Server status
app.get('/',(req,res) => { 
	res.json({
		message: 'Node API Server is UP'
	});
	log.log({
		level: 'info',
		label: 'server.js',
		messgae: 'Test call to Backend Server'
	});
});

//Route to Authentication - This includes Signup and Login
const AuthRoute = require('./routes/signup');
app.use('/api',AuthRoute);

//Route to Profile - Fetch and Update
const Profile = require('./routes/profile');
app.use('/profile',Profile);

//Route to Group - Add Family Member, Fetch and Delete
const Group = require('./routes/group');
app.use('/group',Group);

//Route to Password - Change Password, Forget Password
const Password = require('./routes/password');
app.use('/password',Password);



//Start Server
httpServer.listen(8080);
httpsServer.listen(8443);
