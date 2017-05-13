const Project = require('../api/models/projectModel');
const User = require('../api/models/userModel')
const Event = require('../api/models/eventModel');
const Attachment = require('../api/models/attachmentModel');
const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const _ = require('lodash');

console.log('Seeding the Database');

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [
  { 
    _id: userOneId,
    email: 'kamil@example.com', 
    password: 'password1',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'test@example.com', 
    password: 'password2'
  }
]

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

var createUsers = () => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()
    return Promise.all([userOne, userTwo])
  })
  .then(() => {
    console.log('Users inserted')
  })
}

var createProjects = function(data) {
  var newProjects = projects.map(function(project) {
    return createDoc(Project, project);
  });

  var addEvent = function(project, event) {
    project.events.push(event);
    return new Promise(function(resolve, reject) {
      project.save(function(err, saved) {
        return err ? reject(err) : resolve(saved)
      });
    });
  };

  return Promise.all(newProjects)
    .then(function(projects) {
      return Promise.all(projects.map(function(project, i){
        return addEvent(project, data.events[i])
      }));
    })
    .then(function() {
      return 'Seeded DB with 3 Projects, 3 Events and 3 Attachments.';
    });
};

var createEvents = function(data) {
  var newEvents = events.map(function(event, i) {
    return createDoc(Event, event);
  });

  var addAttachment = function(event, attachment) {
    event.attachments.push(attachment);
    return new Promise(function(resolve, reject) {
      event.save(function(err, saved) {
        return err ? reject(err) : resolve(saved)
      })
    })
  };

  return Promise.all(newEvents)
    .then(function(events) {
      return Promise.all(events.map(function(event, i){
        return addAttachment(event, data.attachments[i])
      }));
    })
    .then(function(events) {
      return _.merge({events: events}, data || {});
    })
};

var createAttachments = function(data) {
  var newAttachments = attachments.map(function(attachment, i) {
    return createDoc(Attachment, attachment);
  });

  return Promise.all(newAttachments)
    .then(function(attachments) {
        return _.merge({attachments: attachments}, data || {});
      })
};

cleanDB()
  .then(createAttachments)
  .then(createEvents)
  .then(createProjects)
  .then((msg) => {
    console.log(msg)
  })
  .then(createUsers)
  .catch((err) => {
    console.log(err);
  })
