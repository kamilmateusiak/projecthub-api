const Project = require('../api/models/projectModel');
const _ = require('lodash');

console.log('Seeding the Database');

const projects = [
  {name: 'Archicom', description: 'opis'},
  {name: 'Wielton', description: 'opis2'},
  {name: 'Zzysh', description: 'opis3'}
];

var createDoc = function(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, saved) {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDB = function() {
  console.log('... cleaning the DB');
  var cleanPromises = [Project]
    .map(function(model) {
      return model.remove().exec();
    });
  return Promise.all(cleanPromises);
}

var createProjects = function(data) {
  var promises = projects.map(function(project) {
    return createDoc(Project, project);
  });

  return Promise.all(promises)
    .then(function(projects) {
      return _.merge({projects: projects}, data || {});
    });
};

cleanDB()
  .then(createProjects)
  .catch((err) => {
    console.log(err);
  })
