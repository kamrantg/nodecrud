const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        require: false,
    },

    description: {
        type: String,
        required: true,
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },

    publishDate: {
        type: Date,
        required: true,
        default: null
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],

    likeCount: {
        type: Number,
        default: 0
    },

    content: {
        type: String,
        required: true
    }
})


const Post = mongoose.model('post', PostSchema)
module.exports = Post