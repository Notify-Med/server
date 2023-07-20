const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: Date,
        default: new Date(),
        required: true
    },

})

const User = mongoose.model('User',userSchema);
module.exports = User;
