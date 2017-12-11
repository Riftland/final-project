const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');
const User = require('../models/User.model');

//Ruta para poke finder
router.get('/:id', (req,res,next) => {
  Pokemon.findOne({'pokeId':req.params.id})
    .then(pokeFinded => {
      return res.json({token: jwt.sign({
        _id: pokeFinded._id,
        id: pokeFinded.pokeId,
        name: pokeFinded.name,
        front: pokeFinded.imgUrlFront,
        back: pokeFinded.imgUrlBack,
        stats: pokeFinded.stats,
        moves: pokeFinded.mvm
      }, 'RESTFULLAPIs')});
    })
    .catch(error => {
      res.status(401).json({message: `That ID doesn't exists`});
    })
});

//Ruta para añadir pokemon al equipo
router.post('/add/:id', (req,res,next) => {
  console.log('================' + req.params.id);
  console.log('================' + req.body.id + ' | ' + req.body.pokeName);
  User.update({'_id':req.params.id},
    {$push: {team: req.body.id, pokeNames: req.body.pokeName}, first_time: false})
      .then(() => {
        res.status(200).json({message: 'Registration succeded'});
      })
      .catch(error => {
        res.status(402).json({message: 'Problems during registration'});
      })
});

module.exports = router;
