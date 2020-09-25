const pgp = require('pg-promise')({
});
const process =require('process');
var instance;

 const connection = "postgres://postgres:PbCNGv2HkiLW@104.196.65.199/svetadweepam_db";
// const connection = "";
 instance = pgp(connection);

 console.log(connection);

module.exports = {

    
  instance: instance,
  pgp:pgp,
  
};  

// const connection = "postgres://postgres:Cfg46rXPxB2i@35.200.205.38/aepdb";
// // const connection = "postgres://postgres:Cfg46rXPxB2i@35.200.193.169/aepdb";
// const instance = pgp(connection);
 




