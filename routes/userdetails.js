var express = require('express');
var router = express.Router();
var details = require('../model/userdetails');

// var bodyParser = require('body-parser');
// router.use(bodyParser.json({ limit: '50mb' }));
// router.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// router.use((req, res, next) => {
//   res.set('Content-Type', 'text/html');
//   next();
// });

// const Multer = require('multer');
// const multer = Multer({
//   storage: Multer.memoryStorage,
//   limits: {
//     fileSize: 5 * 1024 * 1024
//   }
// });


// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart({
//   uploadDir: './uploads'
// });


/* GET home page. */





router.get('/', function (req, res, next) {
  res.render('index', { title: 'Svetadweepam' });
});

router.get('/connectiondetails', function (req, res, next) {

  details.getConnectionUserDetails().then(data => {
    console.log(data);
    return res.status(200).send({ success: true, data: data, msg: 'Connection Success', error: null });
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'Error while getting the details', error: error });
  });


});

router.get('/getDetailsOfUser', function (req, res, next) {

  details.getUserDetails().then(data => {
    console.log(data);
    return res.status(200).send({ success: true, data: data, msg: 'Connection Success', error: null });
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'Error while getting the details', error: error });
  });


});

router.post('/postconnectiondetails', function (req, res, next) {

  var newObj = {
    Name: 'bhavana',
  }

  details.postConnectionUserDetails(newObj).then(data => {
    console.log(data);
    return res.status(200).send({ success: true, data: data, msg: 'Connection Success', error: null });
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'Error while getting the details', error: error });
  });


});
router.post('/register', function (req, res, next) {
  var data = req.body;
  console.log(data);
  var user = {
    user_email: data.emailId,
    user_password: data.password,
    user_firstname: data.firstName,
    user_lastname: data.lastName,
    user_mobile_number: data.phoneNumber,
    user_role_type: 2,
  
  }


  details.insertUserRecord(user).then(data1 => {

    console.log(data1);

    return res.status(200).send({ success: true, data: data1, msg: 'New user details inserted', error: null });
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'failed to insert details', error: error });
  });
});

router.get('/getyears', function (req, res, next) {

  details.getYears().then(data => {
    console.log(data);
    return res.status(200).send({ success: true, data: data, msg: 'List of years', error: null });
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'Error while getting the years details', error: error });
  });


});


router.get('/getmonths', function (req, res, next) {

  details.getMonths().then(data => {
    console.log(data);
    return res.status(200).send({ success: true, data: data, msg: 'List of months', error: null });
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'Error while getting the months details', error: error });
  });


});



router.post('/fileupload', function (req, res, next) {
  var body = req;

  details.uploadToGCS(req).then(data => {
    console.log(data);
    var magazineDetails = {
      year_id: req.body.year,
      month_id: req.body.month,
      file_upload_path: data

    }
    details.insertMagazinepath(magazineDetails).then(data1 => {
      console.log(data1);
      return res.status(200).send({ success: true, data: data1, msg: 'File path updated successfully', error: nulls });
    }).catch(error =>{
      console.log(error);
      return res.status(400).send({ success: false, data: null, msg: 'Error while Inserting the path details', error: error });
    })
  }).catch(error => {
    console.log(error);
    return res.status(400).send({ success: false, data: null, msg: 'Error while uploading the file', error: error });
  })
})


router.post('/signinform', function (req, res, next) {
  var user = req.body;
  details.getUserId(user).then(data => {
    console.log(data);
    details.getUserEmail(data[0].email).then(data1 => {
      console.log(data1);
      if (user.password === data[0].password) {
        var user1 = {
          "user_email": data[0].email,
          "user_password": data[0].password,
        }
        console.log(user1);
        return res.status(200).send({ success: true, data: { data: user1, roleType: 2 }, msg: 'success', error: err })
      }
    })

  })
})




module.exports = router;