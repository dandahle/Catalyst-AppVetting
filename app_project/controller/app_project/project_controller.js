var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject"),
    Checklist       = require("../../models/app_project/AppProjectPlanChecklist");

module.exports.get_projects         = get_projects;
module.exports.view_projects        = view_projects;
module.exports.delete_all_projects  = delete_all_projects;
module.exports.view_project         = view_project;
module.exports.get_project          = get_project;
module.exports.get_plan_checklist   = get_plan_checklist;

async function get_projects(req, res) {
  var projects = await AppProject.find({})
    // .populate({path: "workItems", model: "WorkItem",
    //     populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.status(200).json(projects);
}

/**
 * Returns the project data as JSON
 * @param {*} req - req.params.project_id
 * @param {*} res 
 */
async function get_project(req, res) {
  var project = await AppProject.findById(req.params.project_id)
      .populate({path: "workItems", model: "WorkItem",
                populate: {path: "materialsItems", model: "MaterialsItem"}});
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).end();
  }
}

async function view_projects(req, res) {
  res.render("app_project/view_projects", {});
}

async function view_project(req, res) {
  res.render("app_project/view_project", {project_id: req.params.project_id});
}

async function delete_all_projects(req, res) {
  var projects = await AppProject.find({})
      .populate({path: "workItems", model: "WorkItem",
        populate: {path: "materialsItems", model: "MaterialsItem"}});
  for (var project of projects) {
    for (var workItem of project.workItems) {
      await MaterialsItem.deleteMany({workItem: workItem._id});
    }
    await WorkItem.deleteMany({appProject: project._id});
  }
  await AppProject.deleteMany({});
  await Checklist.deleteMany({});
  res.status(200).end();
}

async function get_plan_checklist(req, res) {
  if (req.params.project_id) {
    var project_id = req.params.project_id;
    
    var checklist = await Checklist.find({project: project_id});
    if (checklist.length == 0) {
      checklist = new Checklist();
      checklist.project = project_id;
      await checklist.save();
    } else {
      checklist = checklist[0];
    }
    res.status(200).json(checklist);
  } else {
    res.status(404).end();
    return;
  }
}