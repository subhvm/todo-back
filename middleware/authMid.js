const jwt = require('jsonwebtoken');
const User = require('../models/login');



const authMiddleware = async(req,res,next)=>{
    const authHeader = req.header('Authorization');

    if(!authHeader|| !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'No token provided, authorization denied'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user){
            return res.status(401).json({message: 'User not found, authorization denied'});
        }
        next();
    }
    catch(err){
    console.error(err);
    res.status(401).json({message:'Token is not valid.'});
    }
};

module.exports = authMiddleware;