const Case = require('./case.model');
const Tooth = require('./tooth.model');

Case.hasMany(Tooth, { foreignKey: 'caseId', onDelete: 'CASCADE' });
Tooth.belongsTo(Case, { foreignKey: 'caseId' });

module.exports = {
    Case,
    Tooth,
  };