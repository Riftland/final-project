const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');

//Ruta para poke finder
router.post('/:id', (req,res,next) => {
  Pokemon.findOne({'pokeId':req.params.id})
    .then(pokeFinded => {
      return res.json({token: jwt.sign({
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

module.exports = router;
