const mongoose = require('mongoose');

let adminlogSchema = new mongoose.Schema({
    questname:String,
    reason:String,
    time:time
})

const adminlog = mongoose.model('adminlog',adminlogSchema)
module.exports = adminlog