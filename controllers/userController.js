const user = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) =>{
    try {
        let {username, password} = req.body;
        let newUser = await user.findOne({username: username});
        if(newUser)
        {
            return res.json({
                success: false,
                message: 'Username is exist'
            })
        }
        else
        {
            bcrypt.hash(password, 10, function (err, hash) {
                if(err)
                {
                    res.json({
                        success: false,
                        error: err.message
                    })
                }
                else
                {
                    const newUser = new user({
                        username:username,
                        hash_password: hash
                    })
                    newUser.save()
                        .then(nUser =>{
                            res.json({
                                success: true,
                                data: user

                            });
                        })
                        .catch(err =>{
                            res.json({
                                success: false,
                                error: err.message
                            })
                        })
                }
            })
        }
    }
    catch (e) {
        console.log(e);
        return res.json({
            success: false,
            error: err.message
        })
    }

}
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
}