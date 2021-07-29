
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        minlength: 3
    },
    points:{
        type: Number,
        require: true,
        default: 0
    }
});


const User = mongoose.model('user', userSchema);
module.exports = User;
