import { Meteor } from 'meteor/meteor';
import StubCollections from 'meteor/hwillson:stub-collections';
import { dbSeason } from '../db/dbSeason';
import { testdoLoginObserver } from '../server/intervalCheck';
import { chai } from 'meteor/practicalmeteor:chai';

describe('No Login Day', function() {
  beforeEach(function() {
    StubCollections.stub([Meteor.users, dbSeason]);
  });

  it('will count when cross at least two day point in each login', function() {
    dbSeason.insert({ beginDate: new Date(2017, 1, 1, 10, 0) });
    Meteor.users.insert({
      _id: 'test_id',
      status: {
        lastLogin: {
          date: new Date(2017, 1, 2, 10, 0),
          ipAddr: '0.0.0.0'
        }
      }
    });

    testdoLoginObserver();

    Meteor.users.update({ _id: 'test_id' }, {
      status: {
        lastLogin: {
          date: new Date(2017, 1, 4, 10, 0),
          ipAddr: '0.0.0.0'
        }
      }
    });

    chai.assert(Meteor.users.findOne({ _id: 'test_id' }).profile.noLoginDayCount === 1);
  });

  afterEach(function() {
    StubCollections.restore();
  });
});
