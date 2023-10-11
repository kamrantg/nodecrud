const Post = require('../Models/Post.model')
const User = require('../Models/User.model')
const createError = require('http-errors')
const _IMAGE = 'data: image/png;base64,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'




module.exports = {
    createPost: async (req, res, next) => {
        const { title, description, isPublished, content } = req.body
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        try {
            const user = await User.findOne({ token })
            const post = await new Post({
                title,
                image: await req.file ? req.file.filename : _IMAGE,
                description,
                isPublished,
                publishDate: Date.now(),
                author: user.id,
                content
            })
            await post.save({ sanitize: true })
            user.posts.push(post.id)
            await user.save()
            const findedPost = await Post.findById(post.id, { __v: 0 }).populate({
                path: 'author',
                select: '-password -token -__v -_id -posts',
            })

            const { likes, ...final } = findedPost.toObject()


            res.send({ ...final, isLiked: findedPost.likes.includes(user.id) })
        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },


    deletePost: async (req, res, next) => {
        const id = req.params.id
        if (id == 'all') {
            const authHeader = req.headers['authorization']
            const token = authHeader.split(' ')[1]
            try {
                const user = await User.findOne({ token })
                if (!user) throw createError(404, 'user not found');
                user.posts = new Array
                await user.save()
                const post = await Post.deleteMany({ author: user.id })
                if (!post) throw createError(404, 'post not found')
                res.send({ status: 1, message: 'all posts deleted' })
            } catch (e) {
                if (e.name === "ValidationError") {
                    next(createError(422, e.message))
                    return
                }
                next(e)
            }
        } else {
            const authHeader = req.headers['authorization']
            const token = authHeader.split(' ')[1]
            try {
                const user = await User.findOne({ token })
                if (!user) throw createError(404, 'user not found');
                const postIndex = user.posts.indexOf(id);
                if (postIndex === -1) throw createError(404, 'post not found')
                user.posts.splice(postIndex, 1);
                await user.save()
                const post = await Post.findByIdAndDelete(id)
                if (!post) throw createError(404, 'post not found')
                res.send({ status: 1, message: 'post deleted' })
            } catch (e) {
                if (e.name === "ValidationError") {
                    next(createError(422, e.message))
                    return
                }
                next(e)
            }
        }

    },

    updatePost: async (req, res, next) => {
        const id = req.params.id
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        const { title, description, isPublished } = req.body
        try {
            const user = await User.findOne({ token })
            if (!user) throw createError(404, 'user not found');
            const post = await Post.findOneAndUpdate({ _id: id, author: user.id }, {
                title,
                ...(await req.file && { image: req.file.filename }),
                description,
                isPublished
            })
            if (!post) throw createError(404, 'post not found')
            const updatedPost = await Post.findById(id, { __v: 0 }).populate({
                path: 'author',
                select: '-password -token -__v -_id -posts'
            })
            if (!updatedPost) throw createError(404, 'post not found')
            const { likes, ...final } = updatedPost.toObject()
            res.send({ ...final, isLiked: updatedPost.likes.includes(user.id) })
        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },


    like: async (req, res, next) => {
        const id = req.params.id
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1]
        try {
            const user = await User.findOne({ token })
            if (!user) throw createError(404, 'user not found');
            const post = await Post.findById(id)
            if (!post) throw createError(404, 'post not found')
            if (post.likes.includes(user.id)) {
                const userIdIndex = await post.likes.indexOf(id)
                await post.likes.splice(userIdIndex, 1)
                post.likeCount = await post.likes.length
                post.save()
                res.send({ status: 1, message: 'unliked' })
            } else {
                await post.likes.push(user.id)
                post.likeCount = await post.likes.length
                post.save()
                res.send({ status: 1, message: 'liked' })
            }
        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    }
}