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

  attachments: [{ type: Schema.Types.ObjectId, ref: 'attachment' }]

});

module.exports = mongoose.model('event', EventSchema);
