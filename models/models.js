const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  }
})

const exerciseSchema = new Schema({
  username: {
    type: String,
    ref: 'User'
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  duration: Number,
  date: String,
})

const UserModel = mongoose.model('User', userSchema);
const ExerciseModel = mongoose.model('Exercise', exerciseSchema);

module.exports = {UserModel, ExerciseModel}