'use strict';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { dbAdvertising } from './dbAdvertising';
import { dbCompanies } from './dbCompanies';
import { dbDirectors } from './dbDirectors';
import { dbFoundations } from './dbFoundations';
import { dbLog } from './dbLog';
import { dbOrders } from './dbOrders';
import { dbPrice } from './dbPrice';
import { dbProducts } from './dbProducts';
import { dbProductLike } from './dbProductLike';
import { dbRankCompanyPrice } from './dbRankCompanyPrice';
import { dbRankCompanyProfit } from './dbRankCompanyProfit';
import { dbRankCompanyValue } from './dbRankCompanyValue';
import { dbRankUserWealth } from './dbRankUserWealth';
import { dbSeason } from './dbSeason';
import { dbTaxes } from './dbTaxes';
import { dbValidatingUsers } from './dbValidatingUsers';
import { dbVoteRecord } from './dbVoteRecord';
import { config } from '../config';

if (Meteor.isServer) {
  Migrations.add({
    version: 1,
    name: 'Create indexes.',
    up() {
      dbAdvertising.rawCollection().createIndex({
        paid: -1
      });
      dbCompanies.rawCollection().createIndex({
        companyName: 1
      });
      dbCompanies.rawCollection().createIndex(
        {
          lastPrice: -1
        },
        {
          partialFilterExpression: {
            isSeal: false
          }
        }
      );
      dbCompanies.rawCollection().createIndex(
        {
          listPrice: -1
        },
        {
          partialFilterExpression: {
            isSeal: false
          }
        }
      );
      dbCompanies.rawCollection().createIndex(
        {
          totalValue: -1
        },
        {
          partialFilterExpression: {
            isSeal: false
          }
        }
      );
      dbCompanies.rawCollection().createIndex(
        {
          profit: -1
        },
        {
          partialFilterExpression: {
            isSeal: false
          }
        }
      );
      dbCompanies.rawCollection().createIndex(
        {
          createdAt: -1
        },
        {
          partialFilterExpression: {
            isSeal: false
          }
        }
      );
      dbCompanies.rawCollection().createIndex(
        {
          manager: 1
        },
        {
          partialFilterExpression: {
            isSeal: false
          }
        }
      );
      dbDirectors.rawCollection().createIndex({
        companyId: 1,
        stocks: -1,
        createdAt: 1
      });
      dbDirectors.rawCollection().createIndex(
        {
          companyId: 1,
          userId: 1
        },
        {
          unique: true
        }
      );
      dbDirectors.rawCollection().createIndex({
        userId: 1
      });
      dbFoundations.rawCollection().createIndex({
        companyName: 1
      });
      dbFoundations.rawCollection().createIndex({
        createdAt: 1
      });
      dbLog.rawCollection().createIndex({
        createdAt: -1
      });
      dbLog.rawCollection().createIndex({
        companyId: 1,
        createdAt: -1
      });
      dbLog.rawCollection().createIndex({
        userId: 1,
        createdAt: -1
      });
      dbOrders.rawCollection().createIndex({
        companyId: 1,
        userId: 1
      });
      dbOrders.rawCollection().createIndex(
        {
          companyId: 1,
          unitPrice: -1,
          createdAt: 1
        },
        {
          partialFilterExpression: {
            orderType: '購入'
          }
        }
      );
      dbOrders.rawCollection().createIndex(
        {
          companyId: 1,
          unitPrice: 1,
          createdAt: 1
        },
        {
          partialFilterExpression: {
            orderType: '賣出'
          }
        }
      );
      dbOrders.rawCollection().createIndex({
        userId: 1
      });
      dbPrice.rawCollection().createIndex({
        companyId: 1,
        createdAt: -1
      });
      dbPrice.rawCollection().createIndex({
        createdAt: 1
      });
      dbProducts.rawCollection().createIndex({
        overdue: 1
      });
      dbProducts.rawCollection().createIndex({
        companyId: 1,
        overdue: 1
      });
      dbProducts.rawCollection().createIndex(
        {
          seasonId: 1,
          votes: -1
        },
        {
          partialFilterExpression: {
            overdue: {
              $gt: 0
            }
          }
        }
      );
      dbProducts.rawCollection().createIndex(
        {
          companyId: 1,
          likeCount: -1
        },
        {
          partialFilterExpression: {
            overdue: {
              $gt: 0
            }
          }
        }
      );
      dbProductLike.rawCollection().createIndex({
        companyId: 1,
        userId: 1
      });
      dbRankCompanyPrice.rawCollection().createIndex({
        season: 1
      });
      dbRankCompanyProfit.rawCollection().createIndex({
        season: 1
      });
      dbRankCompanyValue.rawCollection().createIndex({
        season: 1
      });
      dbRankUserWealth.rawCollection().createIndex({
        season: 1
      });
      dbSeason.rawCollection().createIndex({
        beginDate: -1
      });
      dbValidatingUsers.rawCollection().createIndex({
        username: 1
      });
      dbVoteRecord.rawCollection().createIndex(
        {
          companyId: 1,
          userId: 1
        },
        {
          unique: true
        }
      );
    }
  });

  Migrations.add({
    version: 2,
    name: 'add chairman/chairmanStocks into companies.',
    up() {
      dbCompanies
        .find(
          {},
          {
            fields: {
              _id: 1
            }
          }
        ).forEach((companyData) => {
          const chairmanData = dbDirectors.findOne(
            {
              companyId: companyData._id
            },
            {
              sort: {
                stocks: -1,
                createdAt: 1
              },
              fields: {
                userId: 1
              }
            }
          );
          dbCompanies.update(companyData._id, {
            $set: {
              chairman: chairmanData.userId
            }
          });
        });
    }
  });

  Migrations.add({
    version: 3,
    name: 'users add profile.validateType field.',
    up() {
      Meteor.users.update(
        {
          'services.google': {
            $exists: true
          }
        },
        {
          $set: {
            'profile.validateType': 'Google'
          }
        },
        {
          multi: true
        }
      );
      Meteor.users.update(
        {
          'username': {
            $exists: true
          }
        },
        {
          $set: {
            'profile.validateType': 'PTT'
          }
        },
        {
          multi: true
        }
      );
    }
  });

  Migrations.add({
    version: 4,
    name: 'taxes index, users add lastSeasonTotalWealth and noLoginDayCount field.',
    up() {
      dbTaxes.rawCollection().createIndex({
        userId: 1
      });
      Meteor.users.update(
        {},
        {
          $set: {
            'profile.lastSeasonTotalWealth': 0,
            'profile.noLoginDayCount': 0
          }
        },
        {
          multi: true
        }
      );
    }
  });

  Migrations.add({
    version: 5,
    name: 'change !system director data to !FSC director data.',
    up() {
      dbDirectors.update(
        {
          userId: '!system'
        },
        {
          $set: {
            userId: '!FSC'
          }
        },
        {
          multi: true
        }
      );
    }
  });

  Migrations.add({
    version: 6,
    name: 'users add favorite',
    up() {
      Meteor.users.update(
        {},
        {
          $set: {
            favorite: []
          }
        },
        {
          multi: true
        }
      );
    }
  });

  Migrations.add({
    version: 7,
    name: 'season add companies count field.',
    up() {
      dbSeason.update(
        {},
        {
          $set: {
            companiesCount: 0
          }
        },
        {
          multi: true
        }
      );
    }
  });

  Migrations.add({
    version: 8,
    name: 're define dbProduct seasonId field.',
    up() {
      const seasonIdList = dbSeason
        .find({}, {
          sort: {
            beginDate: -1
          },
          fields: {
            _id: 1
          }
        })
        .map((seasonData) => {
          return seasonData._id;
        });
      _.each(seasonIdList, (seasonId, index) => {
        const shouldBeSeasonId = index > 0 ? seasonIdList[index - 1] : '';
        dbProducts.update(
          {
            seasonId: seasonId
          },
          {
            $set: {
              seasonId: shouldBeSeasonId
            }
          },
          {
            multi: true
          }
        );
      });
    }
  });

  Migrations.add({
    version: 9,
    name: 'company add salary, nextSeasonSalary and seasonalBonusPercent field.',
    up() {
      dbCompanies.update(
        {},
        {
          $set: {
            salary: config.defaultCompanySalaryPerDay,
            nextSeasonSalary: config.defaultCompanySalaryPerDay,
            seasonalBonusPercent: config.defaultSeasonalBonusPercent
          }
        },
        {
          multi: true
        }
      );
    }
  });

  Meteor.startup(() => {
    Migrations.migrateTo('latest');
  });
}
