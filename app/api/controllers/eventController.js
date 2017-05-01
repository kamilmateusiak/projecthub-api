const Project = require('../models/projectModel')
const Event = require('../models/eventModel')
const Attachment = require('../models/attachmentModel')
const _ = require('lodash');
const Promise = require('bluebird')

exports.params = function(req, res, next, id) {
  Event.findById(id)
    .populate('attachments')
    .exec()
    .then(function(event) {
      if (!event) {
        next(new Error('No event with that id'));
      } else {
        req.event = event;
        next();
      }
    }, function(err) {
      next(err);
    });
};

exports.post = (req, res, next) => {
  var data = req.body;
  var attachments = req.body.attachments
  var newEvent = req.body.newEvent
  var project = req.body.project
  var attachmentsIds = []
  return Promise.map(attachments, (attachment) => {
    return Attachment.create(attachment)
      .then((item) => {
        attachmentsIds.push(item._id)
      })
    })
    .then(() => {
      newEvent.attachments = attachmentsIds
      return Event.create(newEvent)
        .then((event) => {
          return Project.findOne({'name': project})
            .then((project) => {
              project.events.push(event._id)
              return project.save()
            })
        })
    })
    .then(() => {
      res.json(data)
    })
    .catch((err) => {
      next(err)
    })
}

exports.put = function(req, res, next) {
  var event = req.event;
  var updateEvent = req.body.event;
  var updateAttachments = req.body.attachments;
  let updatedAtts = []

  return Promise.map(updateAttachments, (attachment) => {
    if (attachment._id) {
      return Attachment.findOneAndUpdate({'_id': attachment._id}, attachment)
        .then((item) => {
          updatedAtts.push(item._id)
        })
        .catch((err) => {
          console.log('Err: ', err, ' Couldnt update existing attachment record')
        })
    } else {
      return Attachment.create(attachment)
        .then((item) => {
          updatedAtts.push(item._id)
        })
        .catch((err) => {
          console.log('Err: ', err, ' Couldnt create attachment record')
        })
    }
  })
  .then(() => {
    updateEvent.attachments = updatedAtts
    _.merge(event, updateEvent)
    event.save(function(err, saved) {
      if (err) {
        next(err);
      } else {
        res.json(saved);
      }
    })
  })
};

exports.delete = (req, res, next) => {
  req.event.remove((err, removed) => {
    if (err) {
      next(err);
    } else {
      res.json(removed);
    }
  });
};
