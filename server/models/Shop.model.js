const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema ({
  items: [{
    type: Type.Schema.ObjectId, ref: 'Item'
  }],
  pokemons: [{
    type: Type.Schema.ObjectId, ref: 'Pokemon'
  }]
});

module.exports = mongoose.model('Shop', ShopSchema);
