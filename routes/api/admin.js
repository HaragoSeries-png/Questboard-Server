const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
  fs = require('fs')
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();
var lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() -7);

router.put('/decide', function (req, res) {
    let questid = req.body.quest_id
    try {
      Quest.findById(questid).then(quest => {      
        if (req.body.approve) {
          console.log('in app')
          quest.status = 'waiting'
          quest.rate = req.body.rate
          User.findById(quest.helperID).then(user=>{
            let noti = {message:"Approve",quest_id:questid,questname:quest.questname,date:Date.now()}
            console.log(noti)
            user.unreadnoti.push(noti)
            user.havenoti = true
            user.save()
            quest.save()
            console.log(quest.status)
            return res.send({success:true,noti:user.unreadnoti})
          })
        }
        else {
          quest.status = 'reject'       
          User.findById(quest.helperID).then(user=>{
            let noti = {message:"reject",quest_id:questid,questname:quest.questname,date:Date.now()}
            console.log(noti)
            user.unreadnoti.push(noti)
            user.havenoti = true
            user.save()
            quest.save()
            console.log(quest.status)
            return res.send({success:true,noti:user.unreadnoti})
          })       
        }
        
      })
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
router.get('/dash',function(req,res){
  Quest.aggregate([{$unwind: "$category"},{$group:{_id:"$category",count:{$sum:1}}}]).sort('_id').then(function(q){
    res.send(q)
  })
})
router.get('/wee',function(req,res){
  console.log(lastWeek)
  Quest.aggregate([
    
    {
      $project: {
          createdAt: {
              $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt"
              }
          },
          author: 1,
          comment: 1

      }
  },

  // Stage 2
  {
      $group: {
          _id: {
              createdAt: '$createdAt'
          },
          qcount: {
              $sum: 1
          }
      }
  },

  // Stage 3
  {
      $project: {
          createdAt: '$_id.createdAt',
          qcount: '$qcount',
          _id: 0
      }
  }
    

]).sort('createdAt').then(function(q){
    res.send(q)
  })
})


module.exports = router