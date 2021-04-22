const { json } = require('body-parser');
const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();
var Ql
const Qc = Quest.watch()
Qc.on('change',change=> { 
  let ql = (Math.floor(Date.now() / 1000))
  console.log('q'+ql)
  Ql =  ql
})



  
multer = require('multer'),
  bodyParser = require('body-parser'),
  dateFormat = require("dateformat");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/public')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limit: 500000,
  fileFilter: fileFilter
});

router.get('/questid/:id', function (req, res) {
  console.log('getid')
  Quest.findById(req.params.id).populate('contributor').populate('wait').then(async (quest) => {
    let ownerID = quest.helperID  
    console.log('-------------------------------------------')

    User.findById(ownerID).then(async (owner) => {
      let ownerName = owner.infoma.firstname + " " + owner.infoma.lastname
      let rim = quest.remain()
      let ownerInfo = {ID: ownerID, name: ownerName,remain:rim}     
      return res.send({quest: quest, owner: ownerInfo,success: true})
    })
  })
})

// router.get('/feed', function (req, res) {
//   let page = Math.max(0, req.query.page)
//   let perPage = 12
//   let cat = req.query.cat
//   var count =0
//   var numall  =0
//   var fquery = '_id questname questdetail duedate image'
//   console.log('count pre  '+count)
//   if(cat){
//     Quest.find({ status: "waiting",category:cat})
//     .select(fquery)
//     .then(async quest => {
//       numall = quest.length
//       count = await Math.ceil(numall/perPage)
//       console.log('count cat '+count)
//     })
//     .then(async q=>{
//       if(cat){   
//         Quest.find({ status: "waiting",category:cat})
//         .select(fquery)
//         .limit(perPage)
//         .skip(perPage*page)
//         .sort({rdate:-1})
//         .then(quest => {
          
//           res.send({ quest: quest, success: true,pagenum:count })
//         })
//       }
//       else{  
//         Quest.find({ status: "waiting"})
//         .select(fquery)
//         .limit(perPage)
//         .skip(perPage*page)
//         .sort({rdate:-1})
//         .then(quest => {   
//           console.log('cou '+count)
//           console.log('------------------------------------------')
//           res.send({ quest: quest, success: true,pagenum:count })
//         })
//       }
//     })
//   }
//   else{
//     Quest.find({ status: "waiting"})
//     .then(async quest => {
//       numall = quest.length
//       count = await Math.ceil(numall/perPage)
//       console.log('count nocat '+count)
//     })
//     .then(q=>{
//       if(cat){   
//         Quest.find({ status: "waiting",category:cat})
//         .select(fquery)
//         .limit(perPage)
//         .skip(perPage*page)
//         .sort({rdate:-1})
//         .then(quest => {
          
//           res.send({ quest: quest, success: true,pagenum:count })
//         })
//       }
//       else{  
//         Quest.find({ status: "waiting"})
//         .select(fquery)
//         .limit(perPage)
//         .skip(perPage*page)
//         .sort({rdate:-1})
//         .then(quest => {   
//           console.log('cou '+count)
//           console.log('------------------------------------------')
//           res.send({ quest: quest, success: true,pagenum:count })
//         })
//       }
//     })
//   }  
// })
router.get('/feed', function (req, res) {  
  var fquery = '_id questname questdetail duedate image'

    Quest.find({ status: "waiting"})
    .select(fquery)
    .sort({rdate:-1})
    .then(quest => {   
      console.log(quest.createdAt)
      console.log(quest.updatedAt)
      console.log('------------------------------------------')
      res.send({ quest: quest, success: true,questnum:quest.length})
    })
  }  
)


router.post('/',  passport.authenticate('pass', {
  session: false
}),upload.single('image'), function (req, res) {
  let filename = ''
  if(req.file!=null){
    filename=req.file.filename
  }
  else{
    filename='default.png'
  }
  
  let newquest = {
    helper: req.user.fistname,
    helperID: req.user._id,
    questname: req.body.questname,
    category: req.body.category,
    questdetail: req.body.questdetail,
    reward: req.body.reward,
    status: "pending",       //original is pending
    image: filename,
    date: dateFormat(new Date(), "longDate"),
    rdate: Date.now(),
    duedate: req.body.duedate,
    numberofcon: req.body.numberofcon,
    wait: [],
    contributor:[],
    rate:0
  }

  Quest.create(newquest).then((quest, err) => {
    if (err) {
      console.log("err " + err)
      return res.send({ success: false })
    }
    req.user.ownquests.push(quest)
    console.log(req.user.quests)
   
    req.user.save()
    return res.send({ success: true, questid: quest._id })
  })
})

router.put('/accept', passport.authenticate('pass', {
  session: false
}), function (req, res) {
  console.log(req.body.quest_id)
  let questid = req.body.quest_id
  let adventurer = req.user._id
  console.log("idd "+questid)
  Quest.findById(questid).then(quest => {
    console.log(quest)
    quest.wait.push(adventurer)
  
    quest.save()
    return res.json({success:true})
  })
})


router.put('/select', passport.authenticate('pass', {
  session: false
}), function (req, res) {
  
  let questid = req.body.quest_id
  let contid = req.body.cid
  let approve = req.body.approve
  let detail = contid.map((cid,i)=>{
    let tde = {cid:cid,approve:approve[i]}
    return tde
  })
  Quest.findById(questid).then(quest => {
    try {
      detail.forEach((de) => {  
        console.log(de.approve)  
        if (de.approve) {
          console.log('iftrue')
          quest.wait.pull(de.cid)
          quest.contributor.push(de.cid)
          User.findById(de.cid).then(user=>{
            user.accquest.push(questid)
            user.unreadnoti.push({message:'quest accept',quest:{quest_id:questid,questname:quest.questname}})
            user.save()
          })
        }
        quest.save()
        
      }); 
    } catch (error) {
      return res.send({success:false})
    }
    
    return res.send({success:true})
  })  
})

router.get('/test', function (req, res) {
  // let questid = req.body.quest_id
  // Quest.findById(questid).then(async (quest) => {
  //   let remain = await quest.remain()
  //   console.log(remain)
  //   return res.send({ remain: remain })
  // })
  let d =Ql+' d'
  console.log('d '+d)
  return res.send(d) 
})

router.delete('/', function (req, res) {
  console.log(req.body.quest_id)
  Quest.findByIdAndDelete(req.body.quest_id).then(quest => {
    res.send(quest)
  })
})
router.put('/complete',function(req,res){
  Quest.findById(req.body.quest_id).then(quest=>{
    quest.status= 'complete'
    quest.save()
    res.send({success:true})
  })
})
router.put('/rate', passport.authenticate('pass', {
  session: false
}), function (req, res) { 
  console.log("test rate from back")
  let detail =req.body.detail 
  detail.forEach((de) => {
    User.findById(de.conName).then(user=>{
  
      user.setrating(de.conRate)
      user.save()
    })
  }); 
  return res.send({success:true})
})
router.put('/start',function(req,res){
  Quest.findById(req.body.quest_id).then(quest=>{
    quest.status= 'inprogress'
    quest.save()
    res.send({success:true})
  })
})


module.exports = router;