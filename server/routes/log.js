const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Log = require('../models/Log.model');


//Ruta para obtener los datos de la última victoria
router.get('/', (req, res, next) => {
  Log.find()
    .populate('winner', 'looser')
    .then(log => {
      return res.status(200).json(log[log.length - 1]);
    })
    .catch(error => {
      res.status(401).json({message: `There isn't log`});
    })
});

module.exports = router;
