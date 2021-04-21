const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
const { ConnectionStates } = require('mongoose');
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();

router.get('/',passport.authenticate('pass', {
    session: false
}),async function(req,res){
    console.log('noti')
    let user = req.user
    if(user.unreadnoti.length){
        console.log('have notiiiiiiiiiiiiiiiiii')       
        user.notify.push.apply(user.notify,user.unreadnoti)
        user.unreadnoti =[]
        let notify = user.notify
        user.havenoti = false
        user.save()
        res.send({sucess:true,notify})
    }
    else{
        console.log('kalm')
        res.send({sucess:false})
    }       
})


module.exports = router;