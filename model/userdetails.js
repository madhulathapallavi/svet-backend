var db = require('../model/db');
var instance = db.instance;
var pgp = db.pgp;


module.exports = {
    // getEducationalQualificationsListNew: getEducationalQualificationsListNew,

    getConnectionUserDetails: getConnectionUserDetails,
}

// function getEducationalQualificationsListNew() {
//     qry = instance.any("SELECT * FROM aepschema.listofeducationqualification");
//     console.log(qry);
//     return qry;
  
//   }

  function getConnectionUserDetails() {
    qry = instance.any("SELECT * FROM svetadweepam_schema.connection_test_table");
    console.log(qry);
    return qry;
  
  }