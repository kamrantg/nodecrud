const User = require('../Models/User.model')
const createError = require('http-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')

module.exports = {

    // GET USER INFO
    getUserInfo: async (req, res, next) => {
        const authHeader = req.headers['authorization']
        if (!authHeader) return next(createError(401, 'token should not be empty'))
        const token = authHeader.split(' ')[1]
        try {
            jwt.verify(token, config.secretKey, async (error, decrypted) => {
                if (error) return next(createError(403, 'invalid token'))
                try {
                    const user = await User.findOne({ token }, { __v: 0, password: 0, }).populate({
                        path: 'posts',
                        select: '-__v',
                        populate: {
                            path: 'author',
                            select: '-password -token -__v -posts',
                        }
                    })
                    if (!user) throw createError(404, 'user not found')
                    if (user.username != decrypted.username || user.token != token) throw createError(403, 'access forbiden')
                    const result = await Promise.all(
                        user.posts.map(item => {
                            const isLiked = item.likes.includes(user.id)
                            const { likes, content, ...final } = item.toObject()
                            return { ...final, isLiked }
                        })
                    )

                    const { posts, ...finalUser } = user.toObject()

                    res.send({ ...finalUser, posts: result })
                } catch (e) {
                    if (e.name === "ValidationError") {
                        next(createError(422, e.message))
                        return
                    }
                    next(createError(e))
                }

            })

        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },

    // SIGN UP
    signup: async (req, res, next) => {
        try {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            const token = jwt.sign({ username: req.body.username }, config.secretKey)
            const user = new User({
                ...req.body,
                password: hashedPass,
                token
            })
            const result = await user.save()
            const { password, __v, ...final } = result.toObject()
            res.send(final)
        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },

    // LOGIN

    login: async (req, res, next) => {
        const { username, password } = req.body
        try {
            const user = await User.findOne({ username })
            if (!user) throw createError(404, 'user not found')
            const isValidPass = await bcrypt.compare(password, user.password)
            if (!isValidPass) throw createError(401, 'invalid password')
            const token = jwt.sign({ username }, config.secretKey)
            const userUpdate = await User.findOneAndUpdate({ username }, { token })
            if (!userUpdate) throw createError(404, 'user not found')
            const selectedUser = await User.findOne({ username }, { __v: 0, password: 0, posts: 0 })
            if (!selectedUser) throw createError(404, 'user not found')
            res.send(selectedUser)
        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },

    logout: async (req, res, next) => {
        const authHeader = req.headers['authorization']
        if (!authHeader) return next(createError(401, 'token should not be empty'))
        const token = authHeader.split(' ')[1]
        try {
            jwt.verify(token, config.secretKey, async (error, decrypted) => {
                if (error) return next(createError(403, 'invalid token'))
                try {
                    const user = await User.findOne({ token }, { __v: 0, password: 0 })
                    if (!user) throw createError(404, 'user not found')
                    if (user.username != decrypted.username || user.token != token) throw createError(403, 'access forbiden')
                    const userToUpdate = await User.findOneAndUpdate({ token }, { token: null })
                    res.send({ status: 1, message: 'logged out' })
                } catch (e) {
                    if (e.name === "ValidationError") {
                        next(createError(422, e.message))
                        return
                    }
                    next(createError(e))
                }

            })

        } catch (e) {
            if (e.name === "ValidationError") {
                next(createError(422, e.message))
                return
            }
            next(e)
        }
    },


    auth: async (req, res, next) => {
        const authHeader = req.headers['authorization']
        if (!authHeader) return next(createError(401, 'token should not be empty'))
        const token = authHeader.split(' ')[1]
        jwt.verify(token, config.secretKey, async (error, decrypted) => {
            if (error) return next(createError(403, 'invalid token'))
            try {
                const user = await User.findOne({ username: decrypted.username })
                if (!user) throw createError(404, 'user not found')
                if (user.username != decrypted.username || user.token != token) throw createError(403, 'access forbiden')
                next()
            } catch (e) {
                if (e.name === "ValidationError") {
                    next(createError(422, e.message))
                    return
                }
                next(createError(e))
            }

        })
    }
}