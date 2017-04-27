const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AttachmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  href: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('attachment', AttachmentSchema);
