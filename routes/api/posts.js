const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

router.get('/',(req,res)=>{
    console.log("commmmm")
    res.send('Fuckkkk!!')
})
router.post('/',(req,res)=>{
    console.log("i got this tad "+req.body.text.text)
    console.log("i got this kuy "+req.body.text.ku)
})

module.exports = router;