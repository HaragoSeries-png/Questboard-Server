const express = require('express');
const Quest = require('../../models/quest.model');
const { fdatasync } = require('fs');
const mongodb = require('mongodb'),
      passport = require('passport');
      require('../../configs/passport'),
      User = require('../../models/user.model'),
      multer = require('multer'),
      fs = require('fs')
      bodyParser = require('body-parser').json();

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

    fileFilter: fileFilter
});

const router = express.Router();

router.get('/id/:id', passport.authenticate('pass', {
    session: false
}), (req, res) => {
    User.findById(req.params.id).select('username email joinDate infoma rating').then(function( user){
        console.log(user)
        res.send({ success: true, user: user })
    });
});

router.put('/editPro', passport.authenticate('pass', {
    session: false
}), (req, res) => {
    // let newdata = req.body
    console.log('in body exp '+JSON.stringify(req.body.desc))
    console.log('in body dec '+JSON.stringify(req.body.exp))
    let data = req.body
    let keys = Object.keys(data)
    
    for (var v in keys) {
        console.log("key "+keys[v]+' v '+v)
        if (keys[v] == 'skill') req.user.infoma.skill = data.skill
        if (keys[v] == 'exp') req.user.infoma.exp = data.exp
        if (keys[v] == 'desc') req.user.infoma.desc = data.desc
        if (keys[v] == 'education') req.user.infoma.education = data.education
        if (keys[v] == 'contact') req.user.infoma.contact = data.contact
        if (keys[v] == 'intro') req.user.infoma.introduce = data.intro
    }
    
    req.user.save()
    res.send(req.user)
});

router.put('/editPic',  passport.authenticate('pass', {
    session: false
}),upload.single('image'), (req, res) => {
    console.log('/editpic')
    console.log(req.user.infoma.proimage)
    try{
        req.user.infoma.proimage = req.file.filename
        if(req.user.infoma.proimage != ""){
            fs.unlinkSync('@/public/'+ req.user.infoma.proimage)
        }
    }
    catch{
        res.send({success:true})
    }  
    req.user.save()
    res.send({success:true})
}),

router.put('/list',passport.authenticate('pass',{
    session:false
}),(req,res)=>{
    let data= req.body
    if(data.field==skill){
        if(data.flag==1){
            console.log("let add "+data.value)
            req.user.infoma.skills.push(data.value)    
        }
    }
    else if (data.field == contact) {
        if (data.flag == 1) {

            console.log("let add " + data.skill)
            req.user.infoma.contact.push(data.value)
        }
        else {
            console.log("let add " + data.skill)
            req.user.infoma.contact.pull(data.value)
        }
    }
    else if (data.field == education) {
        if (data.flag == 1) {

            console.log("let add " + data.skill)
            req.user.infoma.education.push(data.value)
        }
        else {
            console.log("let add " + data.skill)
            req.user.infoma.education.pull(data.value)
        }
    }


    req.user.save()
    res.send({ success: true })
}),

router.get('/myquest',passport.authenticate('pass', {
    session: false
}),async function(req,res){
    try {
        let questid = req.user.ownquests
        let myquest = await Quest.find().where('_id').in(questid).exec();

        let inprogress = myquest.filter(ele => ele.status == 'inprogress')
        let pending = myquest.filter(ele => ele.status == 'pending')
        let waiting = myquest.filter(ele => ele.status == 'waiting')
        
        return res.json({
            success: true,
            allquest: myquest,
            inprogress : inprogress,
            pending: pending,
            waiting: waiting
        })
    } catch (error) {
        return res.json({success: false})
    }   
}),

router.get('/mywork',passport.authenticate('pass', {
    session: false
}),async function(req,res){
    try {
        let questid = req.user.accquest
        console.log(questid)
        let accquest = await Quest.find().where('_id').in(questid).exec();
        
        console.log('acc '+accquest)
        return res.json({
            success:true,
            allquest:accquest
        })
    } catch (error) {
        return res.json({success:false})
    }   
}),

router.put('/rate',async function(req,res){
    let data = req.body
    let uid = data.uid
    let rating = data.rating
    User.findById(uid).then(async user=>{
      let r = await user.setrating(rating)
      user.save()
      console.log("newrate "+r)
      return res.send({rating: r})
    })
}),

router.delete('/',passport.authenticate('pass', {
    session: false
}), function (req, res) {
    console.log(req.user)
    let uid = req.user
    User.findByIdAndDelete({uid},function(err){
        if(err){
            console.log('err'+err)
            return res.send({error:err})
        }
        return res.end()
    })
})

module.exports = router;