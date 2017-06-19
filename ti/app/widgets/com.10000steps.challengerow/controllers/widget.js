/**
 * Config options:
 * 
 * view - the view to add the widget to
 * taskName - the title
 * taskDescription - a longer description. This will be truncated to 50 characters.
 * stepsWalked - (integer) how many steps have been walked
 * percentComplete - (integer) the percentage complete so far
 */

var ui = require('xp.ui');
var CONFIG = arguments[0] || {};

console.log("Adding row", CONFIG);

$.taskName.text = CONFIG.taskName;
$.goalSteps.text = CONFIG.goalSteps;
$.percentComplete.text = CONFIG.percentComplete;
$.rowImage.image = CONFIG.image;

if(CONFIG.taskDescription) {
	var taskDescription = ui.createLabel({
		left: "5dp",
		html: CONFIG.taskDescription.substring(0, 100) + "...",
		font: {
			fontSize: 10
		}
	});
	
	$.labelContainer.add(taskDescription);
}

CONFIG.view.add($.view);