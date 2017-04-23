const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('project', ProjectSchema);
