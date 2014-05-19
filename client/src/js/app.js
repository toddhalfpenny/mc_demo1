$(document).foundation();

var Backbone = require('backbone'),
Marionette = require('backbone.marionette'),
ExpensesManager = new Marionette.Application(),
Foundation = require('foundation'),
bodytemplate = require("../../templates/body.hbs");
mytemplate = require("../../templates/projects.hbs");

var mobileLogger = mobileCaddy.require('mobileCaddy/mobileLogger');
var smartstore = cordova.require("salesforce/plugin/smartstore");

var ProjectManager = new Marionette.Application();

	ProjectManager.addRegions({
		bodyRegion: "body",
		mainRegion: "#main-region"
	});

	ProjectManager.BodyView = Marionette.ItemView.extend({
		template: bodytemplate,
		className: "off-canvas-wrap",		
		events: {
			"click .list_projects": "itemclicked"
		},


		itemclicked: function(e){
			console.log("Marionette: itemclicked");
			var tmpProjects = new ProjectManager.ProjectCollection([]);
			var syncRefresh = mobileCaddy.require('mobileCaddy/syncRefresh');
			syncRefresh.p2mRefreshTable(
				"MC_Project__ap",
				function(){
					mobileLogger.logMessage('Marionette : Success from refresh table');
					var smartStoreUtils = mobileCaddy.require('mobileCaddy/smartStoreUtils');
					smartStoreUtils.querySoupRecords(
					"MC_Project__ap",
					function(records) {
						var soupContentsList = $j('.projects-list');
						var displayRecords = [];
						$j.each(records, function(i,record) {
							for (var fieldDef in record) {
								switch (fieldDef) {
									case "Name" :
										var projName = record[fieldDef];
										break;
									case "LastModifiedDate" :
										var projLastModifiedDate = record[fieldDef];
										break;
									case "Description__c" :
										var projDesc = record[fieldDef];
										break;
									default :
										break;
								}
							}; // end loop through the object fields	
							displayRecords.push('<li>' + projName + ' : ' + projDesc + '</li>');
							tmpProjects.push({
								name: projName,
								lastModifiedDate: projLastModifiedDate,
								desc : projDesc
							});
						});
						soupContentsList.append(displayRecords.join(""));
					},
					error);
				},
				function(e){
					mobileLogger.logMessage('Marionette : Error from refresh table = ' + e);
			});
		}
	});
	

	ProjectManager.Project = Backbone.Model.extend({});

	ProjectManager.ProjectCollection = Backbone.Collection.extend({
		model: ProjectManager.Project,
		comparator: function (model) {
			return -model.get("lastModifiedDate");
		}
	});



	ProjectManager.ProjectItemView = Marionette.ItemView.extend({
		tagName: "li",
		template: mytemplate
	});


	ProjectManager.ProjectsView = Marionette.CollectionView.extend({
		tagName: "ul",
		itemView: ProjectManager.ProjectItemView,
		className: "projects-list"
	});

	var Handlebars = require('hbsfy/runtime');
		Handlebars.registerHelper("prettyDate", function(secs) {
		var d = new Date(secs * 1000);
		return d.toDateString();
	});


	ProjectManager.on("initialize:after", function(){
		console.log("ProjectManager has started!");
		var projects = new ProjectManager.ProjectCollection([]);
		// var projects = new ProjectManager.ProjectCollection([
		// 	{
		// 	name: "MobileCaddy Demo 1",
		// 	id: 2,
		// 	status: "Open",
		// 	lastModifiedDate: 1389875400
		// 	},
		// 	{
		// 	name: "Big Organisation's Secret Project 1",
		// 	status: "Closed",
		// 	id: 3,
		// 	lastModifiedDate: 1390251872
		// 	},
		// 	{
		// 	name: "NDA Project for XXX",
		// 	status: "Open",
		// 	id: 5,
		// 	lastModifiedDate: 1390039470
		// 	}
		// ]);

	var bodyView = new ProjectManager.BodyView(); 

	var projectsView = new ProjectManager.ProjectsView({
	collection: projects
	});

	ProjectManager.bodyRegion.show(bodyView);
	ProjectManager.mainRegion.show(projectsView);

	});

	ProjectManager.start();

	