const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');
const User = require('../models/User.model');

const distance = 1

//Ruta para guardar la posición actual del usuario
router.post('/loc/:id', (req,res,next) => {

  const minLat = req.body[0] - 0.00005;
  const maxLat = req.body[0] + 0.00005;
  const minLong = req.body[1] - 0.00005;
  const maxLong = req.body[1] + 0.00005;

  const rivalsArray = [];

  const newCoords = {
    location: [req.body[0], req.body[1]]
  }

  User.findByIdAndUpdate({'_id': req.params.id}, newCoords)
    .then(userFinded => {
      User.find({
        $and: [
          {location: {$elemMatch: {$gte: minLat, $lte: maxLat}}},
          {location: {$elemMatch: {$gte: minLong, $gte: maxLong}}}
        ]
        })
        .populate('team')
        .then(users => {
          users.forEach(e => {
            if(e._id + '' !== userFinded._id + ''){
              console.log('Rival encontrado!');
              const rival = {
                    name: e.username,
                    pokeNames: e.pokeNames,
                    team: e.team,
                    gender: e.gender
                  }
              //Pendiente, queda calcular la media de stats de
              //los pokemon del contrincante para hayar al rival más igualado
              console.log(rival);
              return res.status(200).json(rival);
            }
          })
        })
        .catch(error => {
          console.log(error);
        })


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
