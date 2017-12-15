const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');
const User = require('../models/User.model');
const Log = require('../models/Log.model');

/*
Constantes para la búsqueda por cercanía de rivales;
*/
const lat = 0.00005;
const long = 0.00005;

let msgResp = {
  location: 'Location updated',
  fight: false
}

/*
---------------------------------------
Modelo para la construcción de peleas (Primera generación)
---------------------------------------
*/
const pokeTypes = [
  // - Normal: x1/2 Roca, x0 Ghost
  {
    name: 'Normal',
    strong: [],
    weak: ['Rock'],
    zero: ['Ghost']
  },
  // - Fight: x2 Normal-Rock-Ice, x1/2 Flying-Poison-Bug-Psych, x0 Ghost
  {
    name: 'Fight',
    strong: ['Normal', 'Rock', 'Ice'],
    weak: ['Flying', 'Poison', 'Bug', 'Psych'],
    zero: ['Ghost']
  },
  // - Flying: x2 Fight-Bug-Grass, x1/2 Rock-Electric
  {
    name: 'Flying',
    strong: ['Fight', 'Bug', 'Grass'],
    weak: ['Rock', 'Electric'],
    zero: []
  },
  // - Poison: x2 Bug-Grass, x1/2 Poison-Ground-Rock-Ghost
  {
    name: 'Poison',
    strong: ['Bug', 'Grass'],
    weak: ['Poison', 'Ground', 'Rock', 'Ghost'],
    zero: []
  },
  // - Ground: x2 Poison, Rock, Fire, Electric x1/2 Bug-Grass, x0 Flying
  {
    name: 'Ground',
    strong: ['Poison', 'Rock', 'Fire', 'Electric'],
    weak: ['Bug', 'Grass'],
    zero: ['Flying']
  },
  // - Rock: x2 Flying-Bug-Fire-Ice, x1/2 Fight-Ground
  {
    name: 'Rock',
    strong: ['Flying', 'Bug', 'Ice'],
    weak: ['Fight', 'Ground'],
    zero: []
  },
  // - Bug: x2 Poison-Grass-Psych, x1/2 Fight-flying-Ghost-Fire
  {
    name: 'Bug',
    strong: ['Poison', 'Grass', 'Psych'],
    weak: ['Fight', 'Flying', 'Ghost', 'Fire'],
    zero: []
  },
  // - Ghost: x2 Ghost, x0 Normal-Psych
  {
    name: 'Ghost',
    strong: ['Ghost'],
    weak: [],
    zero: ['Normal', 'Psych']
  },
  // - Fire: x2 Bug-Grass-Ice, x1/2 Rock-Fire-Water-Dragon
  {
    name: 'Fire',
    strong: ['Bug', 'Grass', 'Ice'],
    weak: ['Rock', 'Fire', 'Water', 'Dragon'],
    zero: []
  },
  // - Water: x2 Ground-Rock-Fire, x1/2 Water-Grass-Dragon
  {
    name: 'Water',
    strong: ['Ground', 'Rock', 'Fire'],
    weak: ['Water', 'Grass', 'Dragon'],
    zero: []
  },
  // - Grass: 2x Ground-Rock-Water, x1/2 Flying-Poison-Bug-Fire-Grass-Dragon
  {
    name: 'Grass',
    strong: ['Ground', 'Rock', 'Water'],
    weak: ['Flying', 'Poison', 'Bug', 'Fire', 'Grass', 'Dragon'],
    zero: []
  },
  // - Electric: 2x Flying-Water, x1/2 Grass-Electric-Dragon, x0 Ground
  {
    name: 'Electric',
    strong: ['Flying', 'Water'],
    weak: ['Grass', 'Electric', 'Dragon'],
    zero: ['Ground']
  },
  // - Psych: x2 Fight-Poison, x1/2 Psych
  {
    name: 'Psych',
    strong: ['Fight', 'Poison'],
    weak: ['Psych'],
    zero: []
  },
  // - Ice: x2 Flying-Ground-Grass-Dragon, x1/2 Water
  {
    name: 'Ice',
    strong: ['Flying', 'Ground', 'Grass', 'Dragon'],
    weak: ['Water'],
    zero: []
  },
  // - Dragon: x2 Dragon
  {
    name: 'Dragon',
    strong: ['Dragon'],
    weak: [],
    zero: []
  }
]

/*
- Función generadora del multiplicador en función del tipo del atacante y el tipo del defensor
@Params: attackType -> tipo del ataque | typeRival -> tipo del defensor
*/
function getMultiplier(attackType, typeRival){
  let multiplier = 1;
  for(i = 0; i < pokeTypes.length; i++){
    if(pokeTypes[i].name === attackType){
      if(pokeTypes[i].strong.includes(typeRival)){
        multiplier = 2;
        break;
      } else if(pokeTypes[i].weak.includes(typeRival)){
        multiplier = 0.5;
        break;
      } else if(pokeTypes[i].zero.includes(typeRival)){
        multiplier = 0;
        break;
      } else {
        multiplier = 1;
        break;
      }
    }
  }
  return multiplier;
}

/*
- Función para obtener aleatoriamente qué ataque se llevará a cabo en función de la posición
*/
function getAttack(){
  let att;
  let n = ~~(Math.random() * 100);
  if(n >= 0 && n <= 50){
    att = 0;
  } else if(n > 50 && n <= 70){
      att = 1;
    } else if(n > 70 && n <= 85){
        att = 2;
      } else{
        att = 3;
      }
    return att;
  }

/*
- Función encargada de realizar la batalla, sin importar el tamaño del equipo de cada jugador
@Params: user -> objeto usuario activo | rival -> objeto usuario elegido al
  azar entre todos los que se encontraban cerca del usuario
*/
function fight(user, rival) {
  //Igualar no importa, van a cambiarse las propiedades de ambas variables
  //Por eso luego me encuentro que la propiedad team está vacía en el front
  let userTeam = user.team;
  let rivalTeam = rival.team;
  let userPokenames = user.pokeNames;
  let rivalPokenames = rival.pokeNames;

  let logArray = [], imgArray = [];
  let result, winner, looser;

  let totalDmg, att, turn, multiplier, finalAttack;

  while(userTeam.length > 0 && rivalTeam.length > 0){
    if(userTeam[0].stats.speed >= rivalTeam[0].stats.speed){
      turn = userTeam[0];
    } else {
      turn = rivalTeam[0];
    }

    while(userTeam[0].stats.health > 0 && rivalTeam[0].stats.health > 0){

      let msg = '';

      if(turn == userTeam[0]){

        let defense = rivalTeam[0].type[0];
        att = userTeam[0].mvm[getAttack()];
        multiplier = getMultiplier(att.type, defense);
        finalAttack = att.damage * multiplier
        if(rivalTeam[0].stats.defense >= finalAttack){
          totalDmg = 2;
        } else {
          totalDmg = finalAttack - rivalTeam[0].stats.defense;
        }
        rivalTeam[0].stats.health = rivalTeam[0].stats.health - totalDmg;
        //Aquí el push y console
        msg = `${userPokenames[0]}: ${att.name} did ${totalDmg} dmg`;
        imgArray.push(userTeam[0].imgUrlFront);
        turn = rivalTeam[0]

      } else {

        let defense = userTeam[0].type[0];
        att = rivalTeam[0].mvm[getAttack()];
        multiplier = getMultiplier(att.type, defense);
        finalAttack = att.damage * multiplier;
        if(userTeam[0].stats.defense >= finalAttack){
          totalDmg = 2;
        } else {
          totalDmg = finalAttack - userTeam[0].stats.defense;
        }
        userTeam[0].stats.health = userTeam[0].stats.health - totalDmg;
        //Aquí el push y console
        msg = `${rivalPokenames[0]}: ${att.name} did ${totalDmg} dmg`;
        imgArray.push(rivalTeam[0].imgUrlFront);
        turn = userTeam[0]

      }

      logArray.push(msg);
      console.log(msg + ' | ' + finalAttack + ' | ' + totalDmg);

    }

    if(userTeam[0].stats.health <= 0){
      msg = `Winner: ${rivalPokenames[0]} (${rival.username})`;
      winner = rival._id;
      looser = user._id;
      imgArray.push(rivalTeam[0].imgUrlFront);
      userTeam.splice(0, 1);
      userPokenames.splice(0, 1);
    }
    if(rivalTeam[0].stats.health <= 0){
      msg = `Winner ${userPokenames[0]} (${user.username})`;
      winner = user._id;
      looser = rival._id;
      imgArray.push(userTeam[0].imgUrlFront);
      rivalTeam.splice(0, 1);
      rivalPokenames.splice(0, 1);
    }

    logArray.push(msg);

  }

  result = {
    winner: winner,
    looser: looser,
    log: logArray,
    img: imgArray
  }

  return result;

}

/*
- Función para guardar el log de batalla junto al vencedor y al perdedor
@Params: result -> objecto con las propiedades de la batalla resuelta
*/
function saveData(result) {

  Log.create(result, (error, log) => {
    if(error)throw error;
    console.log('Log added!');
  });

}

/*
- Ruta para guardar la posición actual del usuario
- Además se encarga de elegir un contrincante al azar entre los que se
  encuentren cerca y de iniciar la función de pelea
*/
router.post('/loc/:id', (req,res,next) => {

  const rivalsArray = [];

  const newCoords = {
    location: [req.body[0], req.body[1]]
  }

  User.findByIdAndUpdate({'_id': req.params.id}, newCoords, {new: true})
    .populate('team')
    .then(activeUser => {

      console.log('Coords added!');
      //Llamada para encontrar rivales
      findRivals(activeUser, res);
      return;
    })
    .catch(error => {
      res.status(402).json({message: 'Problems during update location'});
    })
});

/*
- Función para encontrar un rival aleatorio entre los más cercanos
@Params: activeUser -> el objeto del usuario actual para, mediante su localización,
  encontrar a los rivales más cercanos
*/
function findRivals(activeUser, res) {

  let result;
  let minLat = activeUser.location[0] - 0.0002;
  let maxLat = activeUser.location[0] + 0.0002;
  let minLong = activeUser.location[1] - 0.0002;
  let maxLong = activeUser.location[1] + 0.0002;

  User.find({
    $and: [
      {location: {$elemMatch: {$gte: minLat, $lte: maxLat}}},
      {location: {$elemMatch: {$gte: minLong, $gte: maxLong}}}
    ]
  })
    .populate('team')
    .then(users => {

        if(users.length > 1){

          let validRivals = [];
          validRivals = users.filter(e => {
            return e._id + '' !== activeUser._id + '';
          })
          let id = ~~(Math.random() * (users.length - 1));

          if(validRivals.length > 0){
            msgResp.fight = true;
          }

          const rival = {
                name: validRivals[id].username,
                pokeNames: validRivals[id].pokeNames,
                team: validRivals[id].team,
                gender: validRivals[id].gender
              }

          result = fight(activeUser, validRivals[id]);
          saveData(result);

          return res.status(200).json(msgResp);

      } else{
        console.log('No hay rival');
        return res.status(200).json(msgResp);
      }
    })
    .catch(error => {
      console.log(error);
    })
}

//Ruta para obtener toda la info del usuario
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
