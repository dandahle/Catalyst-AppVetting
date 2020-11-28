var express = require('express');
var router = express.Router();

var projects_controller = require('../../controller/app_project/projects_controller.js');

router.get('/projects_page', projects_controller.view_projects_page);

router.get('/view_site_assessments', projects_controller.view_site_assessments_page);

router.get('/view_site_assessments/:application_id', projects_controller.view_site_assessment);

router.route('/application/:application_id')
  .get(projects_controller.get_application_data_api);

router.get('/delete_manager', projects_controller.view_delete_manager);
router.delete('/delete_manager', projects_controller.manage_deletion);

module.exports = router;