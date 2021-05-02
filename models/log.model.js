const mongoose = require('mongoose');

let adminlogSchema = new mongoose.Schema({
    message:String,
    sender:String,
})

const adminlog = mongoose.model('adminlog',adminlogSchema)
module.exports = adminlog