const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String
  },

  date: { 
    type: Date, 
    default: Date.now 
  },

  project: { type: Schema.Types.ObjectId, ref: 'project' }

});

module.exports = mongoose.model('event', EventSchema);
