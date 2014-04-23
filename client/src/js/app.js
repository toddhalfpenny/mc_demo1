$(document).foundation();
 
var Backbone = require('backbone'),
Marionette = require('backbone.marionette'),
ExpensesManager = new Marionette.Application(),
Foundation = require('foundation'),
bodytemplate = require("../../templates/body.hbs");
mytemplate = require("../../templates/projects.hbs");

var ProjectManager = new Marionette.Application();

	ProjectManager.addRegions({
		bodyRegion: "body",
		mainRegion: "#main-region"
	});

	ProjectManager.BodyView = Marionette.ItemView.extend({
		template: bodytemplate,
		className: "off-canvas-wrap"
	});

	ProjectManager.Project = Backbone.Model.extend({});

	ProjectManager.ProjectCollection = Backbone.Collection.extend({
		model: ProjectManager.Project,
		//comparator: "lastModifiedDate"
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
		itemView: ProjectManager.ProjectItemView
	});

	var Handlebars = require('hbsfy/runtime');
		Handlebars.registerHelper("prettyDate", function(secs) {
		var d = new Date(secs * 1000);
		return d.toDateString();
	});


	ProjectManager.on("initialize:after", function(){
		console.log("ProjectManager has started!");
		var projects = new ProjectManager.ProjectCollection([
			{
			name: "MobileCaddy Demo 1",
			status: "Open",
			lastModifiedDate: 1389875400
			},
			{
			name: "Big Organisation's Secret Project 1",
			status: "Closed",
			lastModifiedDate: 1390251872
			},
			{
			name: "NDA Project for XXX",
			status: "Open",
			lastModifiedDate: 1390039470
			}
		]);

		var bodyView = new ProjectManager.BodyView(); 

		var projectsView = new ProjectManager.ProjectsView({
		collection: projects
		});

		ProjectManager.bodyRegion.show(bodyView);
		ProjectManager.mainRegion.show(projectsView);
	});

	ProjectManager.start();