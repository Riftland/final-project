const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokemonSchema = new Schema ({
  pokeId: Number,
  name: String,
  type: [String],
  imgUrlFront: String,
  imgUrlBack: String,
  stats: {
    health: Number,
    speed: Number,
    defense: Number
  },
  mvm: [],
  price: Number
});

module.exports = mongoose.model('Pokemon', PokemonSchema);
