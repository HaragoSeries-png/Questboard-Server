const { json } = require('body-parser');
const express = require('express');
const mongodb = require('mongodb'),
  passport = require('passport');
const Quest = require('../../models/quest.model');
const User = require('../../models/user.model');
const router = express.Router();
const writable= require('writable')
var fs = require('fs');

var cloudinary = require('cloudinary');
const { Stream } = require('stream');
var Ql
const Qc = Quest.watch()
Qc.on('change',change=> { 
  let ql = (Math.floor(Date.now() / 1000))
  console.log('q'+ql)
  Ql =  ql
})


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME||'drhjbiawj', 
  api_key: process.env.CLOUD_KEY||'898193298188438',
  api_secret: process.env.CLOUD_SECRET||'OS8XrVqZAZ8daS5elrpA_uvGKMY'
});



// writable.setDefaultEncoding( 'UTF8' ) 
  
multer = require('multer'),
bodyParser = require('body-parser'),
dateFormat = require("dateformat");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public')
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
  limit: 50000,
  fileFilter: fileFilter
});

router.get('/questid/:id', function (req, res) {
  console.log('getid')
  Quest.findById(req.params.id).populate('contributor').populate('wait').then(async (quest) => {
    let ownerID = quest.helperID  
    console.log('-------------------------------------------')

    User.findById(ownerID).then(async (owner) => {
      let ownerName = owner.infoma.firstname + " " + owner.infoma.lastname
      let rim = await quest.remain()
      console.log(rim)
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
  var fquery = '_id questname questdetail duedate image category'

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
  let path = null
  if(req.file!=null){
    filename=req.file.filename
    path = req.file.path
  }
  else{
    filename='default.png'
  }
  var timage = 'default.png'
  

  // console.log('path '+path+' '+ typeof path)
  if(path==null){
    console.log("timage "+timage)
    
    console.log('nimage '+timage)
    let newquest = {
      helper: req.user.fistname,
      helperID: req.user._id,
      questname: req.body.questname,
      category: req.body.category,
      questdetail: req.body.questdetail,
      reward: req.body.reward,
      status: "pending",       //original is pending
      image: timage,
      date: dateFormat(new Date(), "longDate"),
      rdate: Date.now(),
      duedate: req.body.duedate,
      numberofcon: req.body.numberofcon,
      wait: [],
      contributor:[],
      rate:0
    }
    console.log(newquest)
    Quest.create(newquest).then((quest, err) => {
      if (err) {
        console.log("err " + err)
        return res.send({ success: false })
      }
      req.user.ownquests.push(quest)
      console.log(req.user.quests)
     
      req.user.save()
      console.log(quest)
      
    })
    return res.send({ success: true})
  }
  stream = cloudinary.uploader.upload_stream(function(result) {
    // console.log(result);  
    timage = result.secure_url
    console.log("timage "+timage)
    
    console.log('nimage '+timage)
    let newquest = {
      helper: req.user.fistname,
      helperID: req.user._id,
      questname: req.body.questname,
      category: req.body.category,
      questdetail: req.body.questdetail,
      reward: req.body.reward,
      status: "pending",       //original is pending
      image: timage,
      date: dateFormat(new Date(), "longDate"),
      rdate: Date.now(),
      duedate: req.body.duedate,
      numberofcon: req.body.numberofcon,
      wait: [],
      contributor:[],
      rate:0
    }
    console.log(newquest)
    Quest.create(newquest).then((quest, err) => {
      if (err) {
        console.log("err " + err)
        return res.send({ success: false })
      }
      req.user.ownquests.push(quest)
      console.log(req.user.quests)
     
      req.user.save()
      console.log(quest)
      return res.send({ success: true, questid: quest._id })
    })
  }, 
  { public_id: req.body.title });
  fs.createReadStream(path).pipe(stream)
  
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
    req.user.accquest.push(quest._id)  
    req.user.save()
    quest.save()
  })
  res.send({success:true})
})


router.put('/select', passport.authenticate('pass', {
  session: false
}), function (req, res) {
  
  let questid = req.body.quest_id
  let contid = req.body.cid
  let approve = req.body.approve
  var acount = 0
  let detail = contid.map((cid,i)=>{
    let tde = {cid:cid,approve:approve[i]}
    if(approve[i]){
      acount++;
    }
    return tde
  })
  Quest.findById(questid).then(quest => {
    if(quest.remain<acount){
      return res.send({success:false,message:"over"})
    }
    try {
      detail.forEach((de) => {  
        console.log(de.approve)  
        if ((de.approve=='true')||(de.approve==true)) {
          console.log('iftrue')
          quest.wait.pull(de.cid)
          quest.contributor.push(de.cid)
          User.findById(de.cid).then(user=>{
            user.unreadnoti.push({message:'quest accept',quest_id:questid,questname:quest.questname,date:Date.now()})
            user.save()           
          })
        }
        quest.save()
        return res.send({success:true})
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
  console.log('complete')
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
  console.log(detail)
  detail.forEach((de) => {
    User.findById(de.conID).then(user=>{ 
      console.log(user)
      user.setrating(de.conRate)
      user.save()
    })
  }); 
  return res.send({success:true})
})

router.put('/start',function(req,res){
  console.log("start")
  Quest.findById(req.body.quest_id).then(quest=>{
    quest.status= 'inprogress'
    if(quest.wait.length){
      let accquest = await User.find().where('_id').in(quest.wait).exec();
    accquest.forEach(u=>{
      u.accquest.pull(req.body.quest_id)
      u.save()
     })
    }    
    quest.save()
    res.send({success:true})
  })
  
})
router.get('/pp', function(req, res) {
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Public ID: <input type="text" name="title"/></p>'
    + '<p>Image: <input type="file" name="image"/></p>'
    + '<p><input type="submit" value="Upload"/></p>'
    + '</form>');
});

router.post('/pp', function(req, res) { 
  User.updateMany({},{$set:{appquest:''}},{multi:true},function(u){
    return res.send(u)
  })
});

router.post('/ppp',upload.single('image'), function (req, res) {
  let filename = ''
  let des = ''
  if(req.file!=null){
    console.log(req.file.path)
    filename=req.file.filename
    des = req.file.destination
  }
  else{
    filename='default.png'
  }
  return res.send({filename:filename,destination:des})
  
})

module.exports = router;
