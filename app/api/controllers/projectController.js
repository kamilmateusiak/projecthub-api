var Project = require('../models/projectModel');

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