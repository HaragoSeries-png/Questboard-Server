const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
  fs = require('fs')
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();

router.put('/decid', function (req, res) {
    let questid = req.body.quest_id
    try {
      // Quest.findById(questid).then(quest => {      
      //   if (req.body.approve) {
      //     console.log('in app')
      //     quest.status = 'waiting'
      //     quest.rate = req.body.rate
      //     User.findById(quest.helperID).then(user=>{
      //       let noti = {message:"Approve",quest:{quest_id:questid,questname:quest.questname},date:Date.now()}
      //       console.log(noti)
      //       user.notify.push(noti)
      //       user.havenoti = true
      //       user.save()
            
      //     })
      //   }
      //   else {
      //     quest.status = 'reject'       
      //     User.findById(quest.helperID).then(user=>{
      //       let noti = {message:"reject",quest:{quest_id:questid,questname:quest.questname}}
      //       console.log(noti)
      //       user.notify.push(noti)
      //       user.havenoti = true
      //       user.save()
      //     })       
      //   }
      //   quest.save()
      //   console.log(quest.status)
      //   return res.send({success:true})
      // })
    } catch (error) {
      return res.send({success:false})
    }
    
});

router.get('/quest',function(req,res){
  console.log('inn')
  Quest.find({ status: "pending" }).then(quest => {
    res.send({ quests: quest, success: true })
  })
})

router.get('/getall',function(req,res){
  Quest.find({}).then(quest => {
    res.send(quest)
  })
})
router.put('/putlog',function(){
  
})


module.exports = router