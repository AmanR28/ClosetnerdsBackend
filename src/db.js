const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./models/user.model')(sequelize);
db.Profile = require('./models/profile.model')(sequelize);

db.User.hasOne(db.Profile, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
db.Profile.belongsTo(db.User);

db.User.addHook('beforeCreate', async (user, options) => {
  const profile = await db.Profile.create();
  user.profileId = profile.id;
});

db.User.addHook('afterCreate', async (user, options) => {
  const profile = await db.Profile.findByPk(user.profileId);
  await user.setProfile(profile);
});

module.exports = db;
