const Project = require('../models/projectModel')
const Event = require('../models/eventModel')
const _ = require('lodash');

exports.params = (req, res, next, name) => {
  Project.findOne({name: name})
    .then(function(project) {
      if (!project) {
        next(new Error('Can not find project with given id'));
      } else {
        req.project = project
        next()
      }
      return null
    })
    .catch((err) => {
      next(err);
    });
};

exports.get = (req, res, next) => {
  Project.find({})
    .then(function(projects){
      res.json(projects);
    }, function(err){
      next(err);
    });
};

exports.post = (req, res, next) => {
  var newProject = req.body;

  Project.create(newProject)
    .then((project) => {
      res.json(project)
    }, (err) => {
      next(err)
    })
}

exports.getOne = function(req, res, next) {
  Event.find({project: req.project._id})   
    .then((events) => {
      let project = JSON.parse(JSON.stringify(req.project))
      project.events = events
      return res.json(project)
    })
    .catch((err) => {
      next(err);
    });
};