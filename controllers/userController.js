const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) =>{
    try{
        const {username, password} = req.body;
        const userExist = await user.findOne({username: username})
        if(userExist)
        {
            return res.json({
                success:false,
                message: 'The username is already exist on this account!'
            })
        }

        const newUser = new user({
            username:username,
            password:password,
            created:Date.now()
        });
        newUser.hash_password = await bcrypt.hashSync(password, 10);
        await newUser.save();
        return res.json({
            success: true,
            data: newUser
        })
    }
    catch (e) {
        res.json({
            success: false,
            error: e.message
        })
    }

};
exports.sign_in = async (req, res) =>{

    try{
        let {username, password} = req.body;
        const userSignin = await user.findOne({username: username});
        if(!userSignin)
        {
            return res.json({
                success: false,
                error: "Authentication failed. User not found"
            })
        }

        const match = await bcrypt.compareSync(password, userSignin.hash_password)
        if(match)
        {
            res.json({
                success:true,
                token:jwt.sign({username:userSignin.username, _id:userSignin._id},'RESTFULAPIs')
            })
        }
        else {
            res.json({
                success: false,
                error: "Authentication failed. Wrong password"
            })
        }
    }
    catch (e) {
        res.json({
            success: false,
            error: e.message
        })
    }
};
