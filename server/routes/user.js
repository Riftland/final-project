const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Pokemon = require('../models/Pokemon.model');
const User = require('../models/User.model');
const Log = require('../models/Log.model');

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

  let logArray = [];
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
        msg = `${user.username}: ${userPokenames[0]} hizo ${att.name} que causó ${totalDmg} de daño a ${rivalPokenames[0]} - HP: ${rivalTeam[0].stats.health}`
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
        msg = `${rival.username}: ${rivalPokenames[0]} hizo ${att.name} que causó ${totalDmg} de daño a ${userPokenames[0]} - HP: ${rivalTeam[0].stats.health}`
        turn = userTeam[0]

      }

      logArray.push(msg);
      console.log(msg + ' | ' + finalAttack + ' | ' + totalDmg);

    }

    if(userTeam[0].stats.health <= 0){
      msg = `Ganador ${rivalPokenames[0]}`;
      winner = rival._id;
      looser = user._id;
      console.log('============================');
      console.log(msg);
      console.log('============================');
      userTeam.splice(0, 1);
      userPokenames.splice(0, 1);
    }
    if(rivalTeam[0].stats.health <= 0){
      msg = `Ganador ${userPokenames[0]}`;
      winner = user._id;
      looser = rival._id;
      console.log('============================');
      console.log(msg);
      console.log('============================');
      rivalTeam.splice(0, 1);
      rivalPokenames.splice(0, 1);
    }

    logArray.push(msg);

  }

  result = {
    winner: winner,
    looser: looser,
    log: logArray
  }

  saveData(result);

}

/*
- Función para guardar el log de batalla junto al vencedor y al perdedor
@Params: result -> objecto con las propiedades de la batalla resuelta
*/
function saveData(result) {
  //Hay que machacar los resultados anteriores
  Log.create(result, (error, log) => {
    if(error)throw error;
    console.log('Log added!');
    //mongoose.connection.close();
  })

}

/*
- Ruta para guardar la posición actual del usuario
- Además se encarga de elegir un contrincante al azar entre los que se
  encuentren cerca y de iniciar la función de pelea
*/
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
            console.log(users);
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
              console.log(validRivals[id]);
              fight(userFinded, validRivals[id]);

              return res.status(200).json(rival); //La propiedad team estará vacía
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
