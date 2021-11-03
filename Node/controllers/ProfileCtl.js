const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const log = require('../controllers/log');
const Profile = require('../models/profile');


const fetch = (req,res,auth) => {
	Profile.findOne({name:auth.name})
                .then(profile => {
                        if(profile){
                                res.status(200).json({profile});
                        }
                        else{
                                var profile = new Profile({
                                        _id: mongoose.Types.ObjectId(),
                                        name:auth.name
                                });
                                profile.save()
                                .then(result => {
                                        res.status(200).json({result});
                                });
                        }//if else profile
                })
                .catch(error => {
                        res.status(500).json({error});
                        console.log(error);
                });//Profile.findOne.catch
}//const fetch


const update = (req,res,auth) => {
	Profile.findOne({name:auth.name})
                .then(profile => {
                        //If profile is found in DB, update with the details recieved.
                        if(profile){
                                options = { "multi": true, "useFindAndModify":false };
                                updated = {
                                        "$set": {
                                                firstName: req.body.firstname,
                                                lastName: req.body.lastName,
                                                mobile:req.body.phone,
                                                email:req.body.email,
                                                gender:req.body.gender,
                                                age:req.body.age,
                                                qualification:req.body.qualification,
                                                specialization:req.body.specialization,
                                                hospital:req.body.hospital,
                                                experience:req.body.experience,
                                                consultaionTiming:req.body.timing,
                                                fees:req.body.fees,
                                                address:req.body.address,
                                                zip:req.body.pincode,
                                                counry:req.body.country,
                                                city:req.body.city,
                                                state:req.body.state
                                        //      avatar:{data:{buffer:req.body.contentType , contentType: req.body.contentType}}
                                        }
                                };
                                Profile.findOneAndUpdate({name:auth.name}, updated, options, (err, docs) =>  {
                                        if (err){
                                                log.log({
                                                        level: 'error',
                                                        label: 'routes/profile.js/update',
                                                        messgae: err
                                                 });

                                        }
                                        else{
                                                res.status(200).json({docs});
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
                                age:req.body.age,
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

}//const update


module.exports = {fetch,update};

