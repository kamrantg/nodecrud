const express = require('express')
const app = express()
const ProductsRoutes = require('./Routes/Products.route')
const createError = require('http-errors')
require('./Routes/initDb')()
const authRoutes = require('./Routes/Auth.route')
const jwt = require('jsonwebtoken');
const { secretKey } = require('./config')
const User = require('./Models/User.model')
const cors = require('cors')
const PostsRoutes = require('./Routes/Posts.route')
const Post = require('./Models/Post.model')
const mongoose = require('mongoose')
// const wellcome = require('./html/index')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const AuthController = require('./Controllers/Auth.controller')

app.use('/products', AuthController.auth, ProductsRoutes)
app.use('/posts', AuthController.auth, PostsRoutes)
app.use('/auth', authRoutes)


// app.get('/', (req, res, next) => {
//     res.sendFile(__dirname + '/html/index.html')
// })


app.get('/allposts', async (req, res, next) => {
    const authHeader = req.headers['authorization']

    try {
        const posts = await Post.find({}, { __v: 0, }).populate({
            path: 'author',
            select: '-password -token -__v -_id -posts',
        })


        if (authHeader) {
            const token = authHeader.split(' ')[1]
            try {
                jwt.verify(token, secretKey, async (error, decrypted) => {
                    if (error) return next(createError(403, 'invalid token'))
                    try {
                        const user = await User.findOne({ token }, { password: 0, __v: 0, posts: 0 })
                        if (!user) throw createError(404, 'user not found')
                        if (user.username != decrypted.username || user.token != token) throw createError(403, 'access forbiden')
                        const result = await Promise.all(
                            posts.map(item => {
                                const isLiked = item.likes.includes(user.id)
                                const { likes, content, ...final } = item.toObject()
                                return { ...final, isLiked }
                            })
                        )
                        res.send(result)
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
            return
        }


        const result = await Promise.all(
            posts.map(item => {
                const { likes, content, ...final } = item.toObject()
                return { ...final, isLiked: false }
            })
        )



        res.send(result)
    } catch (e) {
        if (e.name === "ValidationError") {
            next(createError(422, e.message))
            return
        }
        next(e)
    }
})


app.get('/post/:id', async (req, res, next) => {
    const authHeader = req.headers['authorization']
    try {
        const post = await Post.findById(req.params.id, { __v: 0, }).populate({
            path: 'author',
            select: '-password -token -__v -_id -posts',
        })
        const { likes, ...final } = post.toObject()
        if (!post) throw createError(404, 'post not found')
        if (authHeader) {
            const token = authHeader.split(' ')[1]
            try {
                jwt.verify(token, secretKey, async (error, decrypted) => {
                    if (error) return next(createError(403, 'invalid token'))
                    try {
                        const user = await User.findOne({ token }, { password: 0, __v: 0, posts: 0 })
                        if (!user) throw createError(404, 'user not found')
                        if (user.username != decrypted.username || user.token != token) throw createError(403, 'access forbiden')
                        res.send({ ...final, isLiked: post.likes.includes(user.id) })
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
            return
        }
        res.send({ ...final, isLiked: false })
    } catch (e) {
        if (e instanceof mongoose.CastError) {
            next(createError(400, 'Invalid post id'))
            return
        }
        next(e)
    }
})

app.use((req, res, next) => {
    next(createError(404, 'not found '))
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.send({
        error: {
            status: error.status || 500,
            message: error.message,
        }
    })
})

app.listen(4444, () => {
    console.log('server is running on port: 4444')
})