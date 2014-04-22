$(document).foundation();
 
var Backbone = require('backbone'),
Marionette = require('backbone.marionette'),
ExpensesManager = new Marionette.Application(),
Foundation = require('foundation'),
bodytemplate = require("../../templates/body.hbs");
mytemplate = require("../../templates/expenses.hbs");

ExpensesManager.addRegions({
	bodyRegion: "body",
	mainRegion: "#main-region"
});

ExpensesManager.BodyView = Marionette.ItemView.extend({
	template: bodytemplate,
	className: "off-canvas-wrap"
});

ExpensesManager.StaticView = Marionette.ItemView.extend({
	template: mytemplate
});

ExpensesManager.on("initialize:after", function(){
	console.log("ExpensesManager has started!");
	var bodyView = new ExpensesManager.BodyView();
	var staticView = new ExpensesManager.StaticView();
	ExpensesManager.bodyRegion.show(bodyView);
	ExpensesManager.mainRegion.show(staticView);
});

ExpensesManager.start();