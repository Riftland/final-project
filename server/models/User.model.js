const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema ({
  username: {type: String, required: true},
  hashed_password: {type: String, required: true},
  first_time: {type: Boolean, default: true},
  gender: {type: String, default: ''},
  team: [{
    type: Schema.Types.ObjectId,
    ref: 'Pokemon'
  }],
  bag: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }],
  coins: {type: Number, default: 0},
  created: {type: Date, default: Date.now}
});

UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.hashed_password);
}

module.exports = mongoose.model('User', UserSchema);
