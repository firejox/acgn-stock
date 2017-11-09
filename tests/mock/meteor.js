const sinon = require('sinon');

const { Mongo } = require('./mongo');

const Meteor = {
  isServer: true,
  loginWithPassword: sinon.stub(),
  methods: sinon.stub(),
  call: sinon.stub(),
  publish: sinon.stub(),
  subscribe: sinon.stub(),
  user: sinon.stub(),
  users: new Mongo.Collection(),
  userId: sinon.stub(),
  startup: sinon.stub(),
  bindEnvironment: sinon.stub(),
  wrapAsync: sinon.stub(),
  setInterval: sinon.stub(),
  Error: sinon.stub()
};

Meteor.userId.returns('FOOBAR');

module.exports = { Meteor };
