const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');
const User = require('../models/User.model');

//Ruta para guardar la posición actual del usuario
router.post('/loc/:id', (req,res,next) => {
  console.log('COORDENADAS: ' + req.body);

  const newCoords = {
    location: req.body
  }

  User.findByIdAndUpdate({'_id': req.params.id}, newCoords)
    .then(() => {
      return res.status(200).json({message: 'Location updated!'});
    })
    .catch(error => {
      res.status(402).json({message: 'Problems during update location'});
    })
});

//Ruta para traer toda la info del usuario
router.get('/:id', (req,res,next) => {
  console.log(req.params.id)
  User.findOne({'_id': req.params.id})
    .populate('team')
    .then(userFinded => {
      userFinded.hashed_password = undefined;
      return res.status(200).json(userFinded);
    })
    .catch(error => {
      res.status(402).json({message: 'Problem during receiving data'});
    })
});

module.exports = router;
