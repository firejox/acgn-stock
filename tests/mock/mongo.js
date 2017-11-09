const sinon = require('sinon');

const Cursors = sinon.stub();
Cursors.prototype.count = sinon.stub();
Cursors.prototype.fetech = sinon.stub();
Cursors.prototype.observe = sinon.stub();

const Collection = sinon.stub();
Collection.prototype.attachSchema = sinon.stub();
Collection.prototype.insert = sinon.stub();
Collection.prototype.update = sinon.stub();
Collection.prototype.remove = sinon.stub();
Collection.prototype.findOne = sinon.stub();
Collection.prototype.find = sinon.stub();
Collection.prototype.find.returns(new Cursors);


Collection.prototype.helpers = sinon.stub();
Collection.prototype.before = {
  insert: sinon.stub(),
  update: sinon.stub(),
};
Collection.prototype.after = {
  insert: sinon.stub(),
  update: sinon.stub(),
};
const Mongo = { Collection, Cursors };

const RemoteCollectionDriver = sinon.stub();
RemoteCollectionDriver.prototype.open = sinon.stub();
RemoteCollectionDriver.prototype.open.returnsThis();

RemoteCollectionDriver.prototype.insert = sinon.stub();
RemoteCollectionDriver.prototype.update = sinon.stub();
RemoteCollectionDriver.prototype.remove = sinon.stub();
RemoteCollectionDriver.prototype.findOne = sinon.stub();
RemoteCollectionDriver.prototype.find = sinon.stub();

const NpmModule = sinon.stub();
NpmModule.prototype.ObjectID = sinon.stub();

const MongoInternals = { RemoteCollectionDriver, NpmModule };

module.exports = {
  Mongo,
  MongoInternals,
};
