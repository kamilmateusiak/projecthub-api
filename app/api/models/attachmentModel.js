const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AttachmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  href: {
    type: String,
    required: true
  },

  event: { type: Schema.Types.ObjectId, ref: 'event' }

});

module.exports = mongoose.model('attachment', AttachmentSchema);
