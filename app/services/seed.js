const Project = require('../api/models/projectModel');
const Event = require('../api/models/eventModel');
const Attachment = require('../api/models/attachmentModel')
const _ = require('lodash');

console.log('Seeding the Database');

const projects = [
  {name: 'Archicom'},
  {name: 'Wielton'},
  {name: 'Zzysh'}
];

const events = [
  {name: 'Faza input', description: 'Archicom - sprint 1'},
  {name: 'Pierwszy design', description: 'Strona główna'},
  {name: 'Główna - design', description: 'Zzysh - strona główna'}
];

const attachments = [
  {name: 'Link 1', href: 'http://www.google.com'},
  {name: 'Link 2', href: 'http://www.google.com'},
  {name: 'Link 3', href: 'http://www.google.com'}
]

var createDoc = function(model, doc) {
  return new Promise(function(resolve, reject) {
    new model(doc).save(function(err, saved) {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDB = function() {
  console.log('... cleaning the DB');
  var cleanPromises = [Project, Event, Attachment]
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
    })
};

var createEvents = function(data) {
  var newEvents = events.map(function(event, i) {
    event.project = data.projects[i]._id;
    return createDoc(Event, event);
  });

  return Promise.all(newEvents)
    .then(function(events) {
      return _.merge({events: events}, data || {});
    });
};

var createAttachments = function(data) {
  var newAttachments = attachments.map(function(attachment, i) {
    attachment.event = data.events[i]._id;
    return createDoc(Attachment, attachment);
  });

  return Promise.all(newAttachments)
    .then(function() {
      return 'Seeded DB with 3 Projects, 3 Events and 3 Attachments.';
    });
};

cleanDB()
  .then(createProjects)
  .then(createEvents)
  .then(createAttachments)
  .then((msg) => {
    console.log(msg)
  })
  .catch((err) => {
    console.log(err);
  })
