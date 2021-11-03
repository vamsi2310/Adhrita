const User = require('../models/user');
const Group = require('../models/group');
const Profile = require('../models/profile');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const log = require('../controllers/log');


const fetchGroup = (req,res,auth) => {
		User.findOne({name:auth.name})
                        .then(userres => {
                                if(userres){
                                Group.findOne({owners:userres.name})
                                .then(groupres => {
                                        if(groupres){
                                                const ids = groupres.members;
                                                User.find().where('_id').in(ids).exec((err, records) => {res.status(200).json({records});});
                                        }
                                        else{
                                                console.log('here');
                                                var group = new Group({owners:[userres.name]});
                                                console.log(group);
                                                group.save().then(groupres => {
                                                        console.log(groupres);
                                                        res.status(200).json({groupres});
                                                })//group.save.then
                                                .catch(error => {
                                                        console.log(error);
                                                });//group.save.catch
                                        }//else
                                });//then
                                }//if
                                else{
                                        res.status(500).json('user not found in DB');
                                }//else
                        })//User.findOne.then
                        .catch(error => {
                                res.status(500).json({error});
                                log.log({
                                        level: 'error',
                                        label: 'routes/gropu/fetch',
                                        messgae: error
                                });

                        });//User.findOne.catch
};//const fetchGroup


const addUser = (req,res,auth,user) => {
	Group.findOne({"owners":auth.name})
                        .then(groupres => {
                                if(groupres){
                                        user.save()
                                        .then(userres => {
                                                groupres.members.push(userres._id);
                                                groupres.save()
                                                .then(groupres => {
                                                        const ids = groupres.members;
                                                        User.find().where('_id').in(ids).exec((err, records) => {res.status(200).json({records});});
                                                });//groupres.save.then

                                        })//user.save.then
                                        .catch(error => {
                                                if(error.code == 11000){res.status(450).json('username already exists, try a different username');}
                                                else{res.status(500).json({error});};
                                        });//user.save.catch
                                }else{res.status(200).json('group not found');}//else
                        });//group.findOne.then
}//const addUser

const fetchProfile = (req,res,auth) => {
		User.findOne({"name":req.body.memberName})
                        .then(userres => {
                                if(userres){
                                        Group.findOne({"members":userres._id})
                                        .then(groupres => {
                                                if(groupres && groupres.owners==auth.name){
                                                        Profile.findOne({name: req.body.memberName})
                                                        .then(profile => {
                                                                if(profile){
                                                                        res.status(200).json({profile});
                                                                }
                                                                else{
                                                                        var profile = new Profile({
                                                                                _id: mongoose.Types.ObjectId(),
                                                                                name:userres.name,
                                                                                email:userres.email,
                                                                                mobile:userres.mobile
                                                                        });
                                                                        profile.save()
                                                                        .then(profileres => {
                                                                                res.status(200).json({profileres});
                                                                        });

                                                                }//if else profile exists for this user already?
                                                        });//Profile.findOne.then
                                                }
                                                else{
                                                        res.status(500).json('user not found in this group');
                                                }//if else user is in this group or not?
                                        })//group.findOne.then
                                }
                                else{
                                        res.status(500).json('user not found');
                                }//if else userres
                        });//user.findOne.then

}//cosnt fetchProfile

const updateProfile = (req,res,auth) => {
User.findOne({"name":req.body.memberName})
                        .then(userres => {
                                if(userres){
                                        Group.findOne({"members":userres._id})
                                        .then(groupres => {
                                                if(groupres && groupres.owners==auth.name){
                                                        Profile.findOne({name: req.body.memberName})
                                                        .then(profile => {
                                                                options = { "multi": true, "useFindAndModify":false };
                                                                update = {
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
                                                                                }
                                                                        };
                                                                Profile.findOneAndUpdate({name: req.body.memberName}, update, options, (err, docs) =>  {
                                                                        if (err){
                                                                                log.log({
                                                                                        level: 'error',
                                                                                        label: 'routes/group.js/updateProfile',
                                                                                        messgae: err
                                                                                });
									}
                                                                        else{
                                                                                res.status(200).json({update});
                                                                        }
                                                                })
                                                                .catch(error => {
                                                                        res.status(500).json({error});
                                                                });

                                                        });//Profile.findOne.then
                                                }
                                                else{
                                                        res.status(500).json('user not found in this group');
                                                }//if else user is in this group or not?
                                        })//group.findOne.then
                                }
                                else{
                                        res.status(500).json('user not found');
                                }//if else userres
                        });//user.findOne.then

}//cosnt updateProfile

const deleteFromGroup = (req,res,auth) => {
User.findOne({name: req.body.memberName })
.then(userres => {
	if(userres){
		Group.findOne({"members":userres._id})
			.then(groupres => {
				if(groupres && groupres.owners==auth.name){
					options = { "multi": true, "useFindAndModify":false };
					update = {
						"$pull": {members: userres._id}
					};//update
					Group.updateOne({"owners":auth.name}, update, options,(err,data) => {
						res.status(200).json({data});
					});//Group.findOneAndUpdate
				}
				else{
					res.status(500).json('user not found in this group');
				}
			})//group.findOne.then
	}
	else{
		res.status(500).json('user not found');
	}
});//user.findByIdAndDelete.then	
};//const deleteFromGroup


module.exports = {fetchGroup, addUser, fetchProfile, updateProfile, deleteFromGroup};
