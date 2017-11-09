var test = require('tape');
var libmock = require('mock-require');

libmock('meteor/meteor', '../mock/meteor');
libmock('meteor/underscore', '../mock/underscore');
libmock('meteor/mizzao:user-status', '../mock/user-status');
libmock('meteor/mongo', '../mock/mongo');

var Meteor = require('meteor/meteor').Meteor;
var Mongo = require('meteor/mongo').Mongo;

var dbSeason = require('../../db/dbSeason').dbSeason;

var testdoLoginObserver = require('../../server/intervalCheck').testdoLoginObserver;

test('No login day computaion test', function(t) {
  t.plan(2);
  
  var stub_cursor = new Mongo.Cursors();
  
  dbSeason.findOne.returns({ beginDate : new Date(2017, 1, 1, 10, 0) });
  Meteor.users.find.returns(stub_cursor);
  Meteor.users.update.callsFake(function (id, info) {
    t.equal(id, "FOOBAR", "update with corrct id");
    t.deepEqual(info, {
      $set: {
        'status.lastLogin.date': new Date(2017, 1, 4, 10, 0)
      },
      $inc: {
        'profile.noLoginDayCount': 1
      }
    }, "update with correct no login day count");
  });

  testdoLoginObserver();

  stub_cursor.observe.yieldTo('changed', {
      _id : "FOOBAR",
      status : {
        lastLogin : {
          date : new Date(2017, 1, 4, 10, 0),
          ipAddr : "0.0.0.0"
        }
      }
    }, {
      _id : "FOOBAR",
      status : {
        lastLogin : {
          date : new Date(2017, 1, 2, 10, 0),
          ipAddr : "0.0.0.0"
        }
      }
    });
});


libmock.stopAll();
