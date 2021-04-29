const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
  const { json } = require('body-parser');
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();
bodyParser = require('body-parser').json(),
// router.get('/0',passport.authenticate('pass', {
//     session: false
// }),async function(req,res){
//     console.log('noti')
//     let user = req.user
//     let force = false
//     let tem=false;
//     console.log('cc '+((user.unreadnoti.length>0)||force))
//     if(((user.unreadnoti.length>0))){        
//         tem=true
//     }
//     if(req.query.force=='true'){
//         force = true
//     }
//     let cal = Boolean(tem||force)
//     if(cal===true){
//         console.log('have notiiiiiiiiiiiiiiiiii')       
//         user.notify.push.apply(user.notify,user.unreadnoti)
//         user.unreadnoti =[]
//         let notify = user.notify
//         console.log(notify)
//         user.havenoti = false
//         user.save()
//         res.send({sucess:true,notify})
//     }
//     else {
//         console.log('kalm\n---------')
//         res.send({sucess:false})
//     }       
// })
router.get('/',passport.authenticate('pass', {
    session: false
}),async function(req,res){
    console.log(req.query.force)
    console.log(req.user.unreadnoti.length>0)
    if((req.user.unreadnoti.length>0)||(req.query.force=='true')){
        console.log('noti')
        let user = req.user
        console.log('have notiiiiiiiiiiiiiiiiii')       
        user.notify.push.apply(user.notify,user.unreadnoti)
        let nnoti = user.unreadnoti.length
        user.unreadnoti =[]
        let notify = user.notify
        // console.log(notify)
        user.havenoti = false
        user.save()
        res.send({sucess:true,notify,nnoti})
        }
    else{
        console.log('kalm')
        res.send({sucess:true})
    }
    }       
)


module.exports = router;
