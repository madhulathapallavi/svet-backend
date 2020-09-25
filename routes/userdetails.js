var express = require('express');
var router = express.Router();
var details = require('../model/userdetails');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Svetadweepam' });
});


router.get('/qualifications/new', function (req, res, next) {
 
    details.getEducationalQualificationsListNew().then(data => {
          console.log(data);
          return res.status(200).send({ success: true, data: data, msg: 'List of educational qualifications', error: null });
        }).catch(error => {
          console.log(error);
          return res.status(400).send({ success: false, data: null, msg: 'Error while getting the educational qualification details', error: error });
        });
   
  
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



module.exports = router;