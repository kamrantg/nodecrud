const express = require('express')
const router = express.Router()
const PostController = require('../Controllers/Post.controller')
const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            cb(null, 'uploads/');
        } catch (error) {
            console.log(error)
        }
    },
    filename: (req, file, cb) => {
        try {

            cb(null, Date.now() + path.extname(file.originalname));
        } catch (error) {
            console.log(error)
        }
    }
});


const upload = multer({ storage: storage });


router.post('/', upload.single('image'), PostController.createPost)

router.post('/like/:id', PostController.like)

router.delete('/:id', PostController.deletePost)


router.patch('/:id', upload.single('image'), PostController.updatePost)


module.exports = router