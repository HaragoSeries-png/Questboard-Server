const mongoose = require('mongoose');
const User = require('./user.model');


let QuestSchema = new mongoose.Schema({
    helper:String,
    helperID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    rate:Number,
    tstart:String,
    tend:String,  
    questname:String,
    category:String,
    questdetail:String,
    reward:String,
    status:String,
    date:String,
    rdate:Date,
    image:String,
    duedate:String,
    virginity:Boolean,
    contributor:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    wait:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    numberofcon:Number,

},{ timestamps: true })

QuestSchema.methods.remain = async function(){
    console.log("numcon "+this.numberofcon)
    console.log("this.contributor.length "+this.contributor.length)
    let remain = this.numberofcon-this.contributor.length
    console.log(remain)
    return remain
}
QuestSchema.methods.cNametoString= function(){
    let cName = this.contributor.map(function(c){
        let ci = c.toString()
        console.log('ci '+ typeof ci)
        let cname = User.findById(ci).then((u)=>{
            let data = {id:u._id,name:u.infoma.firstname}
            console.log('data : '+JSON.stringify(data) )
            return data
        })
       
        return cname
    })
    return  cName
}
QuestSchema.methods.wNametoString= async function(){
    let cName = this.wait.map(function(c){
        let ci = c.toString()
        let cname = User.findById(ci).then(u=>{
            return {_id:u._id,name:u.infoma.firstname}
        })
        return cname
    })
    return cName
}

const Quest = mongoose.model('Quest',QuestSchema)
module.exports = Quest