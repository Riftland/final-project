const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');

const auth = require('./routes/auth');
const poke = require('./routes/poke');

mongoose.connect('mongodb://localhost/pokefight', {
  useMongoclient: true
});

const app = express();
const corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  //Comprobación del cabecero
  //Comprobación de la propiedad 'autorización' del cabecero
  //Comprobación de que pasando dicha propiedad a array, el elemento 0 sea = 'JWT'
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
    jsonwebtoken.verify( req.headers.authorization.split(' ')[1],'RESTFULLAPIs', function(err,decode){
      if(err) req.user = undefined;
      console.log("Success in decodified");
      req.user = decode;
      next();
    });
  }else{
    console.log("Failure");
    req.user = undefined;
    next();
  }
})

app.use('/auth', auth);
app.use('/find', poke);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('Entra en el error');
  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
