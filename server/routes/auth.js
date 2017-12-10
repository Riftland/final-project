const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

//Ruta para hacer registro
router.post('/signup', (req, res, next) => {
  let hashPass = bcrypt.hashSync(req.body.hashed_password, 10);
  let name = req.body.username;
  const newUser = new User({
    username: name,
    hashed_password: hashPass
  })
  newUser.save()
    .then(userSaved => {
      console.log('Parece que entra');
      userSaved.hashed_password = undefined;
      res.json(userSaved);
    })
    .catch(e => res.status(400).json({message:'Some problem during registration'}));
});

//Ruta para hacer login
router.post('/login', (req,res,next) => {
  User.findOne({'username':req.body.username})
    .then(userFinded => {
      if(!userFinded.comparePassword(req.body.hashed_password)){
        res.status(401).json({message:'Auth failed'});
      } else{
        return res.json({token: jwt.sign({ name:userFinded.username, id:userFinded._id, first:userFinded.first_time }, 'RESTFULLAPIs')});
      }
    })
    .catch(error => {
      res.status(401).json({message:'Auth failed in line 36 / auth.js'});
    })
});

module.exports = router;
