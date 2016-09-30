// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function window_open() {
	$.goalStepsView.btnSave.addEventListener('click', btnSave_click);
	
	var goalSteps = Ti.App.Properties.getInt("GoalSteps", -1);
	
	if(goalSteps > -1) {
		$.goalStepsView.txtGoalSteps.value = goalSteps;
	}
}

function btnBack_click() {
	$.goalSteps.close();
}

function btnSave_click() {
	var goalSteps = $.goalStepsView.txtGoalSteps.value;
	
	if(!goalSteps) {
		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames: ['OK'],
			message: 'Please enter goal steps and click save',
			title: 'Enter goal steps'
		});	
		
		alertDialog.show();
		return;
	}
	
	goalSteps = parseInt(goalSteps, 10);
	
	Ti.App.Properties.setInt('GoalSteps', goalSteps);
	args.callback(goalSteps);
	$.goalSteps.close();
}
