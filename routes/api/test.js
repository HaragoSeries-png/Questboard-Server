const { query } = require('express');
const express = require('express');
const mongodb = require('mongodb');
const User = require('../../models/user.model');
      
const router = express.Router();

      

multer = require('multer'),
bodyParser = require('body-parser').json();

router.get('/', function(req,res){
    let da = req.body.a
    console.log('da '+da)
    User.findById(da).then(async function(user){
        let r = await user.getrating().then(res=>{return res})
        console.log("rate "+r)
        return res.send({'rating':r})
    })
    
}) 

router.put('/',function(req,res){
    let da = req.body
    console.log('da '+da.u)
    User.findById(da.u).then((user)=>{
        console.log(user)
        let newdata = {quest:da.q,rating:da.r}
    
        user.comquest.push(newdata)
        user.save()
        return res.send(user)
    })
    
    
})

router.put('del')

module.exports = router;