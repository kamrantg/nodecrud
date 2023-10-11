const mongoose = require('mongoose')

module.exports = () => {
    mongoose.connect('mongodb+srv://cluster0.m7ae7nf.mongodb.net/', {
        dbName: 'productsdb',
        user: 'kamrantg',
        pass: 'm.kamran5559',
    }).then(() => {
        console.log('connected')
    }).catch((e) => {
        console.log(e)
    })


    mongoose.connection.on('connected', () => console.log('connected to MongoDB'))
    mongoose.connection.on('disconnected', () => console.log('\ndisconnected to MongoDB'))
    process.on('SIGINT', async () => {
        await mongoose.connection.close(true)
        process.exit(0)
    })
}