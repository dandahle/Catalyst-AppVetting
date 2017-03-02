var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');

var api = require('../controllers/api');
var User = require('../models/userPackage');
var config = require('../config')

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

// Helper query functions

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport) {
router.get('/', api.getDocumentStatusSite, function(req, res, next) {

	var payload = {};
    console.log(res.locals.results);
	if(res.locals.results.site[0] == null) {
		console.log('[ ROUTER ] /site :: Unable to find Document Packages with status: \'assess\'');
	}
	else {
		res.locals.results.site.forEach(function (element) {
            element = formatElement(element);
        });
	}
	
	payload.site = res.locals.results.site;

	console.log("payload");
	console.log(payload);
	//payload.user = req.user._id;

	//payload.user_email = res.locals.email;

	res.json(res.locals.results);
	//res.render('siteview', payload);
});	

router.get('/:id', api.getDocumentSite, function(req, res, next) {
    //Checking what's in params
    //console.log("Rendering application " + ObjectId(req.params.id));
	//TEST
	console.log("rendering test application");


	var results = {}
	results = res.locals.results;
	console.log("results");
	console.log(results);
    res.json(res.locals.results);

    //    res.locals.layout = 'b3-layout';        // Change default from layout.hbs to b3-layout.hbs
    //    results.title = "Application View";     //Page <title> in header
		
	//	results.user = req.user._id;

    //    res.render('b3-view', results);
    

});
	
function formatElement(element) {
    formatStatus(element);
    formatDate(element);
    return element;
}

/**
 * Takes the VERY long date in the DB and makes it into a nicer format
 * @param element (the document package)
 * @returns: The document package with formatted date
 */
function formatDate(element)
{
	console.log("element updated");
	console.log(element.updated);
    var Year = element.updated.getFullYear();
    //get month and day with padding since they are 0 indexed
    var Day = ( "00" + element.updated.getDate()).slice(-2);
    var Mon = ("00" + (element.updated.getMonth()+1)).slice(-2);
    element.updated = Mon + "/" + Day + "/" + Year;

	if(element.signature && element.signature.client_date != "") {
	console.log("element sig");
	console.log(element.signature.client_date);
	var appYear = element.signature.client_date.getFullYear();
	var appDay = ("00" + element.signature.client_date.getDate()).slice(-2);
	var appMon = ("00" + (element.signature.client_date.getMonth()+1)).slice(-2);
	element.signature.client_date = appMon + "/" + appDay + "/" + Year;
	}
    return element;
}

/**
 * Takes the status string from the DB and makes it more detailed for the front end
 * @param element (the document package)
 * @returns: The document package with wordier status
 */
function formatStatus(element) {
    var status;

    switch (element.status){
        case 'assess':
            status = 'Site Assessment - Pending';
            break;
        default:
            status = element.status;
    }

    element.status = status;
    return element;
}

	
	
	
	
	
return router;
}

//check to see if user is logged in and a vetting agent or an admin
function isLoggedIn(req, res, next) {
		
		if(req.isAuthenticated()) {
			console.log(req.user._id);
			var userID = req.user._id.toString();

			console.log("userID");
			console.log(userID);
			var ObjectId = require('mongodb').ObjectID;
			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				console.log(results);

					if (!results) {
						res.redirect('/user/logout');
					}
					else {
						if(results.user.user_status == "ACTIVE") {
							if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
								res.locals.email = results.user.contact_info.user_email;

								return next();

							}

							else {
								console.log("user is not vet");
								res.redirect('/user/logout');
							}
						}
						else {
							//user not active
							console.log("user not active");
							res.redirect('/user/logout');
						}
					}



			})

		.catch(function(err) {
                console.error(err);
        })
         .catch(next);
		}
		else {
			console.log("no user id");
			res.redirect('/user/login');
		}
}

//post request authenticator.  Checks if user is an admin or vetting agent
function isLoggedInPost(req, res, next) {
		if(req.isAuthenticated()) {
			console.log(req.user._id);
			var userID = req.user._id.toString();

			var ObjectId = require('mongodb').ObjectID;

			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				console.log(results);

					if (!results) {
						//user not found in db.  Route to error handler
						res.locals.status = 406;
						return next('route');
					}
					else {

						if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
							return next();

						}
						else {
							//user is not a vetting agent or admin, route to error handler
							res.locals.status = 406;
							return next('route');
						}
					}



			})

		.catch(function(err) {
                console.error(err);
        })
         .catch(next);
		}
		else {
			//user is not logged in
			console.log("no user id");
			res.locals.status = 406;
			return next('route');
		}
}