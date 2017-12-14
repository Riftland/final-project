const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema ({
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  looser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  log: [String]
})

module.exports = mongoose.model('Log', LogSchema);
