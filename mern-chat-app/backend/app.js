var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var getusersRouter = require('./routes/getUsers');
var allUsersRouter = require('./routes/allUsers');
var editUserRouter = require('./routes/editUser');
var updateUserRouter = require('./routes/updateUser');
var listUsersRouter = require('./routes/listUsers');
var enableUserRouter = require('./routes/enableUser');
var createAssetsRouter = require('./routes/createAssets');
var updateAssetsRouter = require('./routes/updateAssets');
var removeAssetsRouter = require('./routes/removeAssets');
var assetListRouter = require('./routes/getAssetsList');
var userAssetsRouter = require('./routes/userAssets');
var getAssetRouter = require('./routes/getAsset');
var getUserAssetsRouter = require('./routes/getUserAssets');
var removeUserAssetsRouter = require('./routes/removeUserAssets');
var replaceUserAssetsRouter = require('./routes/replaceUserAssets');
var sendEmailRouter = require('./routes/send-email');
var {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup} = require('./routes/chats');
mongoose.set('strictQuery', false);

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect('mongodb+srv://paramesh:paramesh@cluster0.hl1zdom.mongodb.net/users',options,()=>{console.log('DB connected')});

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup',signupRouter);
app.use('/login',loginRouter);
app.use('/getusers',getusersRouter);
app.use('/allusers',allUsersRouter);
app.use('/edituser',editUserRouter);
app.use('/updateuser',updateUserRouter);
app.use('/listusers',listUsersRouter);
app.use('/enableuser',enableUserRouter);
app.use('/createassets',createAssetsRouter);
app.use('/updateassets',updateAssetsRouter);
app.use('/removeassets',removeAssetsRouter);
app.use('/getassets',assetListRouter);
app.use('/userassets',userAssetsRouter);
app.use('/getasset',getAssetRouter);
app.use('/getuserassets',getUserAssetsRouter);
app.use('/removeuserassets',removeUserAssetsRouter);
app.use('/replaceuserassets',replaceUserAssetsRouter);
app.use('/sendemail',sendEmailRouter);
app.use('/chats', accessChat);
app.use('/chats', fetchChats);
app.use('/group', createGroupChat);
app.use('/rename', renameGroup);
app.use('/remove', removeFromGroup);
app.use('/add', addToGroup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
