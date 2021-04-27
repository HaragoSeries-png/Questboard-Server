const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    passport = require('passport');
    require('./configs/passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    passportLocal = require('passport-local'),
    User = require('./models/user.model'),
    methodOverride = require("method-override"),
    fileUpload = require('express-fileupload'),
     path = require('path');
    
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'Qusetboard',
    resave: false,
    saveUninitialized: false
}));
// app.use(fileUpload())
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb+srv://chanon:132231@cluster0-broqy.mongodb.net/Questboard?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(() => {
        console.log('successfully');
    })
    .catch(e => console.log('error'))

app.use(bodyParser.json())
app.use(cors());

const posts = require('./routes/api/posts');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const quest = require('./routes/api/quest');
const test = require('./routes/api/test');
const admin = require('./routes/api/admin');
const noti = require('./routes/api/notification')

app.use('/api/quest', quest);
app.use('/api/posts', posts);
app.use('/api/auth', auth);
app.use('/api/profile',profile);
app.use('/api/test',test);
app.use('/api/admin',admin);
app.use('/api/noti',noti);
const port = process.env.PORT || 5000

app.listen(port, () => console.log('server start at ' + port))