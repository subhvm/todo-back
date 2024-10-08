const express = require('express');
const router = express.Router();
const User = require("../models/login");
const jwt = require('jsonwebtoken');

router.post('/signup', async (req,res)=>{
    const{username,password}= req.body;
    try{
        let user = await User.findOne({username});
        if (user){
            return res.status(400).json({message :'Username already taken'});

        }

        user = new User({username, password});
        await user.save();

        const payload = {userId : user._id};
        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn : '1h'});
        res.status(201).json({token});
    }
    catch(err){
        console.error(err)
        res.status(500).send('Server error');
    }
});



router.post('/login',async(req,res)=>{
    const{username,password}= req.body;

    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message:'Invalid Credentials'});
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch){
            return res.status(400).json({message:'Invalid Credentials'});
        }

        const payload = {userId : user._id};
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn : '1h'});
        res.json({token});
    }

    catch(err){
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
