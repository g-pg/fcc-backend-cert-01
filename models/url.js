const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
  short_url: String,
  original_url: String,
});

module.exports = mongoose.model('URL', URLSchema, 'urls');
