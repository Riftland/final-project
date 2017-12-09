const mongoose = require('mongoose');
const Pokemon = require('../models/Pokemon.model');
mongoose.connect('mongodb://localhost/pokefight');

const pokemon = [
  {
    pokeId: 1,
    name: 'Bulbasaur',
    imgUrlFront: 'https://vignette.wikia.nocookie.net/es.pokemon/images/7/79/Bulbasaur_NB.png/revision/latest?cb=20100919165947',
    imgUrlBack: 'https://vignette.wikia.nocookie.net/es.pokemon/images/b/ba/Bulbasaur_espalda_G5.png/revision/latest?cb=20100921023627',
    stats: {
      health: 45,
      speed: 45,
      defense: 49
    },
    mvm: [
      {
        name: 'Growl',
        damage: 0,
        type: 'Normal'
      },
      {
        name: 'Tackle',
        damage: 40,
        type: 'Normal'
      },
      {
        name: 'Leech Seed',
        damage: 0,
        type: 'Grass'
      },
      {
        name: 'Vine Whip',
        damage: 45,
        type: 'Grass'
      }
    ],
    price: 0
  },
  {
    pokeId: 4,
    name: 'Charmander',
    imgUrlFront: 'https://vignette.wikia.nocookie.net/es.pokemon/images/c/ca/Charmander_NB.png/revision/latest?cb=20100919170001',
    imgUrlBack: 'https://vignette.wikia.nocookie.net/es.pokemon/images/3/33/Charmander_espalda_G5.png/revision/latest?cb=20100921024835',
    stats: {
      health: 39,
      speed: 65,
      defense: 43
    },
    mvm: [
      {
        name: 'Growl',
        damage: 0,
        type: 'Normal'
      },
      {
        name: 'Scratch',
        damage: 40,
        type: 'Normal'
      },
      {
        name: 'Ember',
        damage: 40,
        type: 'Fire'
      },
      {
        name: 'Leer',
        damage: 0,
        type: 'Normal'
      }
    ],
    price: 0
  },
  {
    pokeId: 7,
    name: 'Squirtle',
    imgUrlFront: 'https://vignette.wikia.nocookie.net/es.pokemon/images/d/d8/Squirtle_NB.png/revision/latest?cb=20100919170015',
    imgUrlBack: 'https://vignette.wikia.nocookie.net/es.pokemon/images/a/aa/Squirtle_espalda_G5.png/revision/latest?cb=20100921024842',
    stats: {
      health: 44,
      speed: 43,
      defense: 65
    },
    mvm: [
      {
        name: 'Tackle',
        damage: 40,
        type: 'Normal'
      },
      {
        name: 'Tail Whip',
        damage: 0,
        type: 'Normal'
      },
      {
        name: 'Bubble',
        damage: 40,
        type: 'Water'
      },
      {
        name: 'Water Gun',
        damage: 40,
        type: 'Water'
      }
    ],
    price: 0
  }
]

Pokemon.create(pokemon, (error, poke) => {
  if(error)throw error;
  poke.forEach(e => {
    console.log(`${e.name} added to bbdd`);
  });
  mongoose.connection.close();
})
