var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.view_project_transfers = view_project_transfers;
module.exports.view_project_transfer = view_project_transfer;
module.exports.transfer_project = transfer_project;

async function view_project_transfers(req, res) {
  var assessments = await SiteAssessment.find({status: "complete",})
                      .populate("documentPackage");
  res.render("app_project/project_transfers", {assessments: assessments,});
}

async function view_project_transfer(req, res) {
  // var assessment = await SiteAssessment.findById(req.params.assessment_id)
  //     .populate("documentPackage")
  //     .populate({path: "workItems", model: "WorkItem", populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.render("app_project/project_transfer", {assessment_id: req.params.assessment_id,});
}

async function transfer_project(req, res) {
  console.log(req.params.assessment_id);
  console.log(req.body.project_workitems);
  console.log(req.body.handleit_workitems);
  var project_workitems = req.body.project_workitems,
      handleit_workitems = req.body.handleit_workitems;
  var i, j, id,
      old_workItem, new_workItem,
      projects = {}, project, project_name;
  var siteAssessment = await SiteAssessment.findById(req.params.assessment_id);
  
  for (id in project_workitems) {
    old_workItem = await  WorkItem.findById(id)
      .populate("materialsItems").exec();
    new_workItem = await WorkItem.makeCopy(old_workItem);

    project_name = project_workitems[id]

    if (project_name in projects) {
      projects[project_name].workItems.push(new_workItem._id);
    } else {
      project = new AppProject();
      project.name = project_workitems[id];
      project.siteAssessment = siteAssessment._id;
      project.documentPackage = siteAssessment.documentPackage;
      project.handleit = false;
      
      project.workItems.push(new_workItem._id);

      projects[project_name] = project;
    }
    old_workItem.transferred = true;
    old_workItem.save();
  }

  for (project_name in projects) {
    await projects[project_name].save()
  }

  for (id in handleit_workitems) {
    old_workItem = await WorkItem.findById(id)
      .populate("materialsItems").exec();
    new_workItem = await WorkItem.makeCopy(old_workItem);

    project = new AppProject();
    project.name = old_workItem.name;
    project.siteAssessment = siteAssessment._id;
    project.documentPackage = siteAssessment.documentPackage;
    project.handleit = true;
    
    project.workItems.push(new_workItem._id);
    
    await project.save()
  }

  res.status(200).send();
}