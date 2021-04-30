const express = require('express');
const mongodb = require('mongodb'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  passport = require('passport');
require('../../configs/passport'),
  User = require('../../models/user.model'),
  bodyParser = require('body-parser').json();

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  passport.authenticate(
    'signup', { session: false },
    async (err, user, info) => {
      console.log(info.success)
      if (!info.success) {
        res.json({
          success: info.success,
          message: 'Signup not suck',
          user: req.user
        })
      }
      else {
        newuser = {
          username: req.body.firstname,
          email: req.body.email,
          password: req.body.password,
          verified: false,
          joinDate: Date.now(),
          infoma: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            proimage: ""
          },
          rating:{
            rate:0,
            N:0
          },
          notify:[],
          unreadnoti:[],
          ownquests:[],
          accquest:[]
        }
        console.log(newuser)
        User.create(newuser).then(user => {
          res.json({
            success: true,
            message: 'Signup sucessful',
            username: user.username
          })
        })

      }
    }
  )(req, res, next);
}
);

router.post('/login', async (req, res, next) => {
  passport.authenticate(
    'login', { session: false },
    async (err, user, info) => {
      if (err || !user) {
        message = info.message
        console.log("have err")
        console.log('mess '+message)
        res.json({
          message: message,
          success: false
        });
      }
      else {
        const payload = {
          _id: user._id,
          email: user.email
        };
        console.log("name " + user.username)
        const token = 'Bearer '+ jwt.sign(payload, 'TOP_SECRET');
        user.token.push(token)
        user.havenoti = true
        user.save()
        console.log("token " + token)
        res.json({
          token: token,
          success: true,
          id: user._id,
          username: user.username,
          fullname: user.infoma.firstname + " " + user.infoma.lastname,
          user: user,
          infoma: user.infoma
        });
      }
    }
  )(req, res, next);
}
);
router.post('/logout',passport.authenticate('logout', {
  session: false
}),
  (req,res)=>{
    let token = req.body.token
    let user = req.user
    console.log(JSON.stringify(token))
    user.token.pull(token)
    user.save()
    console.log('logout')
    res.send(true)
  }
)

router.get('/test',(req, res) => {
  let email = req.body.email
  console.log(email)
  User.findOne( {email} ).then(function(user) {
  
   return res.json({
    user:user
  })
    
})
  
})

router.put("/change",function(req,res){
  let email = req.body.email
  let newpass = req.body.pass
  User.findOne( {email} ).then(async function(user) {
  
   
      console.log("Already from pass")
      
      user.password = newpass
      
      user.save()
      console.log("password "+user.password)
      return res.send({user:user})
  })
})



module.exports = router;