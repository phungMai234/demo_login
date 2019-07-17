const user = require('../models/userModel');
const bcrypt = require('bcrypt');

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
exports.sign_in = (req, res) =>{
    let {username, password} = req.body;
    user.findOne({username: username}, function (err, user) {
        if(err)
        {
            throw err;
        }
        if(!user)
        {
            res.json({
                message:'Authentication failed. User not found'
            })
        }
        else if(user)
        {
            if(!user.comparePassword(password))
            {
                res.json({
                    message:'Authentication failed. Wrong password'
                })
            }
        }
        else
        {
            return res.json({
                usernam: username
            })
        }

    })

};
exports.loginRequired = function (req, res, next) {
    if(req.user)
    {
        next();
    }
    else {
        return res.json({
            message: 'Unauthorized user'
        })
    }
};