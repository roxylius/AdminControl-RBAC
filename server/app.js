require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);

//express routers to handle routes
const loginRouter = require('./views/login');
const signupRouter = require('./views/signup');
const userRouter = require('./views/rbac/handleUser');
const googleRouter = require('./views/google');
const githubRouter = require('./views/github');
const logoutRouter = require('./views/logout');
const roleRouter = require('./views/rbac/handleRole');
const permissionRouter = require('./views/rbac/handlePermission');
const logRouter = require('./views/rbac/handleLog');

const app = express();

//set up middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'https://roxylius.github.io/AdminControl-RBAC', 'https://admin-control-rbac.vercel.app', 'http://localhost:7501'], credentials: true, methods: ['GET', 'POST', 'DELETE','PUT'] })); //to enable cross origin resourse sharing ie make post,get,etc request form different url
app.use(bodyParser.urlencoded({ extended: true })); //to read the post request from html form
app.use(express.json()); //to interpret json
var store = new MongoDBStore( //setup to store the session in DB
    {
        uri: process.env.MONGODB_ATLAS,
        collection: process.env.MONGODB_SESSION
    }
);

//event listner to catch the error 
store.on('error', function (error) {
    // Also get an error here
    console.log("There is err storing session: ", error);
});

app.set('trust proxy', 1); //allows express.js behind a reverse proxy to trust proxy server  
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none', //to allow cross-site cookies
        secure: true, // secures the cookie
        maxAge: 1000 * 60 * 60 * 24 * 180 //180 days
    },
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('./schema/user');

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


// Routes
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/user', userRouter);
app.use('/api/auth/google', googleRouter);
app.use('/api/auth/github', githubRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/role', roleRouter);
app.use('/api/permission',permissionRouter);
app.use('/api/log',logRouter);

//testing only 
app.get('/', (req, res) => {
    res.send("server is up and running!");
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

module.exports = app;
