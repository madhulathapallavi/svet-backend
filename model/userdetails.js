var db = require('../model/db');
var instance = db.instance;
var pgp = db.pgp;
// var demotable = new pgp.helpers.TableName('demo_table','aepschema');
// var demoColumns =  new pgp.helpers.ColumnSet(['userid','firstname', 'lastname' ], { demotable}); 

// var connectionTable = new pgp.helpers.TableName('connection_test_table', 'svetadweepam_schema');
// var connectionColumnSet = new pgp.helpers.ColumnSet(['Name'],{connectionTable});

var usersTable = new pgp.helpers.TableName('users','svetadweepam_schema');
var usersColumnSet = new pgp.helpers.ColumnSet(['user_email','user_password','user_role_type','user_firstname','user_lastname','user_mobile_number'],{usersTable})

var fileDetailTable = new pgp.helpers.TableName('monthly_magzine_list','svetadweepam_schema');
var fileColumnSet = new pgp.helpers.ColumnSet(['year_id', 'month_id','file_upload_path'],{fileDetailTable})



const { Storage } = require('@google-cloud/storage');
const CLOUD_BUCKET = 'svet_magazine_dev_bucket';

const storage = new Storage({
  projectid: 'svetadweepam-288613',
  keyFilename: "googleaccess.json",
});

const bucket = storage.bucket(CLOUD_BUCKET);

module.exports = {
    getConnectionUserDetails: getConnectionUserDetails,
    insertUserRecord: insertUserRecord,
    uploadToGCS: uploadToGCS,
    insertMagazinepath: insertMagazinepath,
    getMonths: getMonths,
    getYears: getYears,

}


  function getConnectionUserDetails() {
    qry = instance.any("SELECT * FROM svetadweepam_schema.connection_test_table");
    console.log(qry);
    return qry;
  
  }
 

  function insertUserRecord(data1){
    qry = pgp.helpers.insert(data1,usersColumnSet,usersTable) + " RETURNING *";
    console.log(qry);
    return instance.one(qry);
  }


  async function uploadToGCS(req, next){
    
    if (!req.files) {
      return next();
    }

    if (req.files.selectedfile != undefined) {
      var year;
    await getYearById(req.body.year).then(yeardata =>{
        console.log(yeardata);
        year = yeardata[0].year;
      });
      var month;
      await getMonthById(req.body.month).then(monthdata =>{
        console.log(monthdata);
        month = monthdata[0].eng_month_name;
      })
      
      // var pathToUpload = '2019' + '/' + 'Oct';

      var pathToUpload = year + '/' + month;
        await uploadFileToGcs(req.files.selectedfile, pathToUpload).then(data => {
        console.log(data);
  
        fileUrl = data;
        console.log(fileUrl);
       
      }).catch(error => {
        console.log(error);
        });
    } else {
      fileUrl = "";
      console.log(fileUrl);
    }

    return fileUrl;

  }


  async function uploadFileToGcs(filecontent, pathdetails) {
    return new Promise((resolve, reject) => {
      const gcsname = Date.now().toString() + 'date' + filecontent.name;
      const file = bucket.file(pathdetails + '/' + gcsname);
      const stream = file.createWriteStream({
        metadata: {
          contentType: filecontent.mimetype
        },
        resumable: false
      });
  
      stream.on('error', (err) => {
        filecontent.cloudStorageError = err;
        console.log(err);
        reject(err);
      });
  
      stream.on('finish', () => {
        filecontent.cloudStorageObject = gcsname;
        file.makePublic().then(() => {
          filecontent.cloudStoragePublicUrl = getUploadedPublicUrl(gcsname, pathdetails);
          console.log(filecontent.cloudStoragePublicUrl);
          resolve(filecontent.cloudStoragePublicUrl);
       });
      });
      stream.end(filecontent.data);
    })
  }

  function getUploadedPublicUrl(filename, pathdetails) {

    return `https://${CLOUD_BUCKET}.storage.googleapis.com/${pathdetails}/${filename}`
  
  }



  function insertMagazinepath(details){

    qry = pgp.helpers.insert(details,fileColumnSet, fileDetailTable) + " RETURNING *";
      console.log(qry);
      return instance.one(qry);
  }


  function getMonths(){
    qry = instance.any("SELECT * FROM svetadweepam_schema.months");
    console.log(qry);
    return qry;
  
  }

  function getYears(){
    qry = instance.any("SELECT * FROM svetadweepam_schema.years");
    console.log(qry);
    return qry;
  
  }


  async function getYearById(id){
    qry = instance.any("SELECT year FROM svetadweepam_schema.years where years.year_id = "+ id);
    console.log(qry);
    return qry;
  }


  
  async function getMonthById(id){
    qry = instance.any("SELECT eng_month_name FROM svetadweepam_schema.months where months.month_id = "+ id);
    console.log(qry);
    return qry;
  }