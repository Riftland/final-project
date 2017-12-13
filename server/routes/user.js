const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');
const User = require('../models/User.model');

/*
Modelo para la construcción de peleas
---------------------------------------
- Atacante: Defensores -
- Normal: x1/2 Roca, x0 Ghost
- Fight: x2 Normal-Rock-Ice, x1/2 Flying-Poison-Bug-Psych, x0 Ghost
- Flying: x2 Fight-Bug-Grass, x1/2 Rock-Electric
- Poison: x2 Bug-Grass, x1/2 Poison-Ground-Rock-Ghost
- Ground: x2 Poison, Rock, Fire, Electric x1/2 Bug-Grass, x0 Flying
- Rock: x2 Flying-Bug-Fire-Ice, x1/2 Fight-Ground
- Bug: x2 Poison-Grass-Psych, x1/2 Fight-flying-Ghost-Fire
- Ghost: x2 Ghost, x0 Normal-Psych
- Fire: x2 Bug-Grass-Ice, x1/2 Rock-Fire-Water-Dragon
- Water: x2 Ground-Rock-Fire, x1/2 Water-Grass-Dragon
- Grass: 2x Ground-Rock-Water, x1/2 Flying-Poison-Bug-Fire-Grass-Dragon
- Electric: 2x Flying-Water, x1/2 Grass-Electric-Dragon, x0 Ground
- Psych: x2 Fight-Poison, x1/2 Psych
- Ice: x2 Flying-Ground-Grass-Dragon, x1/2 Water
- Dragon: x2 Dragon
*/

function getAttack(){
  let att;
  let n = ~~(Math.random() * 100);
  if(n >= 0 && n <= 50){
    att = 0;
  } else{
    if(n > 50 && n <= 70){
      att = 1;
    } else{
      if(n > 70 && n <= 85){
        att = 2;
      } else{
        att = 3;
      }
    }
  }
  return att;
}

function fight(user, rival) {
  let userTeam = user.team;
  let rivalTeam = rival.team;
  let userPokenames = user.pokeNames;
  let rivalPokenames = rival.pokeNames;

  let totalDmg, att, turn;

  while(userTeam.length > 0 && rivalTeam.length > 0){
    if(userTeam[0].stats.speed >= rivalTeam[0].stats.speed){
      turn = userTeam[0];
      break;
    } else {
      turn = rivalTeam[0];
      break;
    }

    while(userTeam[0].stats.health > 0 && rivalTeam[0].stats.health > 0){

      let msg = '';

      if(turn == userTeam[0]){

        att = userTeam[0].mvm[getAttack()];
        if(rivalTeam[0].stats.defense >= userTeam[0].att.damage){
          totalDmg = 0;
        } else {
          //Mejorar esto para la diferencia de tipos
          totalDmg = userTeam[0].att.damage - rivalTeam[0].stats.defense;
        }
        rivalTeam[0].stats.health = rivalTeam[0].stats.health - totalDmg;
        //Aquí el push y console
        msg = `${userPokenames[0]} hizo ${att.name} que causó ${totalDmg} de daño a ${rivalPokenames[0]}`
        turn = rivalTeam[0]

      } else {

        att = rivalTeam[0].mvm[getAttack()];
        if(userTeam[0].stats.defense >= rivalTeam[0].att.damage){
          totalDmg = 0;
        } else {
          //Mejorar esto para la diferencia de tipos
          totalDmg = rivalTeam[0].att.damage - userTeam[0].stats.defense;
        }
        userTeam[0].stats.health = userTeam[0].stats.health - totalDmg;
        //Aquí el push y console
        msg = `${rivalPokenames[0]} hizo ${att.name} que causó ${totalDmg} de daño a ${userPokenames[0]}`
        turn = userTeam[0]

      }

      console.log(``);

    }

    if(userTeam[0].stats.health <= 0){
      userTeam.splice(0, 1);
      userPokenames.splice(0, 1);
    }
    if(rivalTeam[0].stats.health <= 0){
      rivalTeam.splice(0, 1);
      userPokenames.splice(0, 1);
    }

  }

}

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
    .populate('team')
    .then(userFinded => {
      User.find({
        $and: [
          {location: {$elemMatch: {$gte: minLat, $lte: maxLat}}},
          {location: {$elemMatch: {$gte: minLong, $gte: maxLong}}}
        ]
        })
        .populate('team')
        .then(users => {
            let activeUser;
            if(users.length > 1){
              let validRivals;
              validRivals = users.filter(e => {
                return e._id + '' !== userFinded._id + '';
              })
              let id = ~~(Math.random() * (users.length - 1));
              const rival = {
                    name: validRivals[id].username,
                    pokeNames: validRivals[id].pokeNames,
                    team: validRivals[id].team,
                    gender: validRivals[id].gender
                  }
              //Pendiente, queda calcular la media de stats de
              //los pokemon del contrincante para hayar al rival más igualado
              fight(userFinded, validRivals[id]);
              return res.status(200).json(rival);
          } else{
            res.status(200).json({messsage: 'No hay rival'});
          }
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
