const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
  const { json } = require('body-parser');
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();
bodyParser = require('body-parser').json(),
router.get('/',passport.authenticate('pass', {
    session: false
}),async function(req,res){
    console.log('noti')
    let user = req.user
    let force = req.query.force
    let boo = user.unreadnoti.length||force
    console.log(boo)
    if(boo=='true'){
        console.log('have notiiiiiiiiiiiiiiiiii')       
        user.notify.push.apply(user.notify,user.unreadnoti)
        user.unreadnoti =[]
        let notify = user.notify
        user.havenoti = false
        user.save()
        res.send({sucess:true,notify})
    }
    else if(boo='false'){
        console.log('kalm\n---------')
        res.send({sucess:false})
    }       
})


module.exports = router;