const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema ({
  name: String,
  description: String,
  price: String
});

module.exports = mongoose.model('Item', ItemSchema);
