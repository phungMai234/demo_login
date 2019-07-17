const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const database = require("../database");

const Schema = mongoose.Schema;

const userShema = new Schema({
    username:{
        type:String,
        trim:true,
        required:true
    },
    hash_password:{
      type: String,
      required: true
    },
    created:{
        type:Date,
        default:Date.now()
    }
}, {versionKey: false});

userShema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password,this.hash_password);
}

const Users = database.model('Users', userShema);
module.exports = Users;