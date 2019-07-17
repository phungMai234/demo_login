const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const key = require('../key.json');

exports.register = async (req, res) =>{
    try{
        const {username, password} = req.body;

        if(!password || !username){
            throw new Error("Please fill in form");
        }

        if(password.length < 8){
            throw new Error("Password must have at least eight characters")
        }

        const userExist = await user.findOne({username: username})


        if(userExist){
              throw new Error('The username is already exist on this account!');
        }

        const newUser = new user({
            username:username,
            password:password,
            created:Date.now()
        });
        newUser.hash_password = await bcrypt.hashSync(password, 10);
        await newUser.save();
        return res.json(response.success(newUser));
    }
    catch (e) {
        res.json(response.fail(e));
    }

};
exports.sign_in = async (req, res) =>{

    try{
        let {username, password} = req.body;
        const userSignin = await user.findOne({username: username});
        if(!userSignin)
        {
            throw new Error("Authentication failed. User not found");
        }

        const match = await bcrypt.compareSync(password, userSignin.hash_password)
        const sixHours = 6*60*60;
        if(match)
        {
                const token = jwt.sign({

                    username:userSignin.username,
                    _id:userSignin._id
                    },
                    key.ACCESS_SECRET_KEY,
                    {
                        expiresIn: sixHours
                    })
            return res.json(response.success(token));
        }
        else {
            throw new Error("Authentication failed. Wrong password");
        }
    }
    catch (e) {
        res.json({
            success: false,
            error: e.message
        })
    }
};
