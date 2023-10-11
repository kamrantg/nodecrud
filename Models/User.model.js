const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // minlength: 4,
    },
    token: {
        type: String,
        required: false,
    },

    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'post',
            required: true
        }
    ]
})

const User = mongoose.model('user', UserSchema)
module.exports = User