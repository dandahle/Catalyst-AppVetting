var express = require('express');
var router = express.Router();

var CareApplicant = require('../../models/care/careApplicant');
var CareService = require('../../models/care/careService');
// var CareContact = require('../../models/care/careContact');

var helper = require("../../controller/helper");
var application_controller = require('../../controller/care/application.js');
var service_controller = require('../../controller/care/service.js');
var appnote_controller = require('../../controller/care/appnote.js');

// router.get('/', helper.isLoggedIn, function(req, res) {
router.get('/', function(req, res) {
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/index", context);
    }
  );
});

// View Page for Applicant Data
router.get('/view_application/:application_id',  function(req, res){
  helper.create_user_context(req).then(
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      // Ajax To Application API used to retrieve application
      // var application = await application_controller.get_applicant(application_id);
      res.render("care/application_page", context);
    }
  );
});

// Edit Applicant Data
router.post('/view_application/:application_id', async function(req, res) {
  var application_id = req.params.application_id;
  await application_controller.update_application(application_id, req.body);
  res.status(200).end();
});

router.get('/application/:application_id', function(req, res){
  helper.create_user_context(req).then(
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      var application = await application_controller.get_applicant(application_id);
      res.status(200).json(application);
    }
  );
});

router.get('/application_form', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/application_form", context);
    }
  );
});

// REST API : GET /applications
router.get('/applications', application_controller.get_applications);

router.get('/view_applications', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/applications", context);
    }
  );
});

router.post('/application', async function(req, res) {
  if (application_controller.check_care_application(req.body)) {
      await application_controller.create_care_applicant(req.body)
      res.status(201).end(); // OK creation
  } else
    res.status(404).end(); // Missing fields
});

// GET Service API
router.get('/services/:service_id', async function(req, res) {
   // Get Services
   var service_id = req.params.service_id;
   service = await service_controller.get_service_data(service_id);
   res.status(200).json(service);
});


router.get('/view_service/:service_id', service_controller.view_service);

router.post('/services', service_controller.post_service);

router.post('/services/:service_id/notes', service_controller.post_note);
router.get('/services/:service_id/notes', service_controller.get_notes);
router.patch('/services/:service_id', service_controller.update_service);

// Services Page
router.get('/view_services', service_controller.view_services);

router.get('/appnote/:application_id', appnote_controller.get_appnotes);

router.post('/appnote', appnote_controller.post_appnote);

module.exports = router;