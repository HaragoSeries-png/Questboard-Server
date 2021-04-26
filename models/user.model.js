const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    verified: Boolean,
    joinDate: Date,
    infoma: {
        firstname: String,
        lastname: String,
        address: String,
        rating: Number,
        introduce: String,
        proimage: String,
        desc: [{
            topic: String,
            desc: String
        }],
        contact: {
            facebook: String,
            line: String,
            call: String,
            email: String
        },
        skill: [{
            skill: String
        }],
        education: [{
            branch: String,
            date: String
        }],
        exp: [{
            topic: String,
            desc: String,
            date: String,
        }],
    },
    ownquests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest'
    }],
    accquest:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest'
    }],
    // comquest:[{
    //     quest:{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Quest' 
    //     },
    //     rating:Number
    // }]
    rating:{
        rate:Number,
        N:Number
    },
    notify:[{
        message:String,
        time: Date,
        quest:{
            quest_id:String,
            questname:String
        } 
        ,date:Date 
    }],
    unreadnoti:[{
        message:String,
        quest:{
            quest_id:String,
            questname:String
        }  
        ,date:Date    
    }],
    havenoti:Boolean,
    token:[String]
})


UserSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    let compare = await bcrypt.compare(password, user.password)
    console.log("comapre "+compare)
    return compare
};

// UserSchema.methods.getrating = async function(){
//     let r = await User.aggregate([
//         { $match: {_id: this._id} },
//         { $addFields: { avgrating: { $avg: "$comquest.rating" } } }
//     ]).then(await function(result){
//         console.log('lett '+result[0].avgrating)
//         return result[0].avgrating
//     })
//     return r
    
// }
UserSchema.methods.setrating = async function(newrate){
    let rating = this.rating;
    let frag = (rating.rate*rating.N)+newrate
    let off =  rating.N+1
    let newrating = frag/off
    rating.rate = newrating
    rating.N = rating.N+1
    return this.rating.rate
}
UserSchema.methods.changepass = async function(newpass){
    const user = this;
    const hash = await bcrypt.hash(newpass, bcrypt.genSaltSync(12));
    let compare = await bcrypt.compare(newpass, hash)
    console.log("hash here"+compare)
    user.password = hash;
    console.log("newpass "+user.password)

    return this.password
}
UserSchema.methods.readed = async function(){
    this.havenoti = false
}



UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema)



module.exports = User

