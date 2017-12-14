const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Log = require('../models/Log.model');


//Ruta para obtener los datos de la última victoria
router.get('/', (req, res, next) => {
  Log.find()
    .then(log => {
      return res.status(200).json(log);
    })
    .catch(error => {
      res.status(401).json({message: `There isn't log`});
    })
});

module.exports = router;
