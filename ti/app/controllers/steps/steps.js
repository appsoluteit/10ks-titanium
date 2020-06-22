/**
 * @file Steps Controller
 * @description The controller for the steps view.
 * @require helpers/FormatHelper
 * @require helpers/DateTimeHelper
 * @require classes/StepsProvider
 * @require widgets/com.mcongrove.toast
 * @namespace Controllers.Steps
 */

var FormatHelper = require('helpers/FormatHelper');
var DateTimeHelper = require('helpers/DateTimeHelper');
var StepsProvider = require('classes/StepsProvider');
var NavBarButton = require('classes/NavBarButton');
var q = require('q');

/**
 * @description Adds a row to the dates table
 * @memberof Controllers.Steps
 * @param {String} strLabel The label to add
 * @param {Date} dateObj The date that this record represents.
 * @param {Boolean} isLoadMoreButton A boolean to indicate whether this is the 'Load More' button
 * @param {Integer} index (Optional) The index to add the new row at. If omitted, it will be appended to the end.
 */
function addDateRow(strLabel, dateObj, isLoadMoreButton, index) {			
	//Add a new row to the table view	
	var row = Ti.UI.createTableViewRow({
		color: 'black',
		height: '50dp',
		
		//custom attributes
		label: strLabel,
		date: dateObj,
		isLoadMoreButton: isLoadMoreButton
	});
	row.addEventListener('click', tblRow_click);
	
	var view = Ti.UI.createView({});
	view.addEventListener('click', function(e) { }); //adding this event handler to the view seems to fix a bug where the event handler
													 //for the row wouldn't fire
	
	var labelLeft = Ti.UI.createLabel({
		left: '10dp',
		textAlign: 'left',
		color: 'black',
		font: {
			fontWeight: 'bold'
		},
		text: strLabel,
		width: Ti.UI.SIZE
	});
	view.add(labelLeft);
	
	//Don't add the # of steps if its a 'Load More' button
	if(!isLoadMoreButton) {
		var color = "#75CFFB"; //synced blue colour
		var numSteps = 0;
		var item = Alloy.Globals.Steps.readByDate(dateObj);
		
		if(item) {
			numSteps = item.stepsTotal;
			
			if(item.lastSyncedOn && item.lastUpdatedOn) {
				if(item.lastUpdatedOn.getTime() > item.lastSyncedOn.getTime()) {
					color = "red";	
				}
			}
			else if(!item.lastSyncedOn) {
				//The item has never been synced. Mark it as red.
				color = "red";
			}
		}	
		
		var numStepsStr = numSteps > 0 ? FormatHelper.formatNumber(numSteps) : "";
		
		var labelRight = Ti.UI.createLabel({
			right: "30dp",
			textAlign: "right",
			color: color,
			text: numStepsStr,
			width: Ti.UI.SIZE,
			font: {
				fontFamily: 'Arial',
				fontSize: '20sp',
				fontWeight: 'normal'
			}
		});
		
		if(color != "red") {
			labelRight.font = {
				fontFamily: 'Arial',
				fontSize: '20sp',
				fontWeight: 'bold'
			};
		}
		
		var chevron = null;
		
		if(Ti.Platform.osname === "android") {
			//On Android, create an ImageView instead of a button
			chevron = Ti.UI.createImageView({
				right: "5dp",
				image: "/common/chevrons/right-16.png"
			});
		}
		else {
			chevron = Ti.UI.createButton({
				right: "5dp",
				image: "/common/chevrons/right-16-g.png",
				tintColor: "gray",
				style: Ti.UI.iOS.SystemButtonStyle.PLAIN
			});
		}
		
		view.add(labelRight);	
		view.add(chevron);	
	}

	row.add(view);		//Adding the view to the TableViewRow causes its properties
						//to become inaccessible by the logEntry controller...need to fix.
	
	if(index === undefined) {
		//Ti.API.info("Appending row");
		$.tblDays.appendRow(row);
	}
	else {
		//Ti.API.info("Inserting row. Index = " + index);
		$.tblDays.insertRowAfter(index, row);	
	}
}

/**
 * @description Adds 30 days to tblDays (the dates table) starting from dateObj, then adds another row that says 'Load More'
 * @memberof Controllers.Steps
 * @param {Date} dateObj The date to start from
 */
function loadDatesFrom(dateObj) {
	var start = dateObj.getDate();
	
	for(var i = start; i >= start - 30; i--) {
		var labelStr = DateTimeHelper.getDateLabel(dateObj, true);
		addDateRow(labelStr, dateObj, false);
		
		dateObj = DateTimeHelper.getDayBefore(dateObj);
	}
	
	addDateRow("Load More", dateObj, true);
}

/**
 * @description Interacts with the `StepsProvider`. Calls `getSteps()`, then `postSteps()`. 
 * @memberof Controllers.Steps
 */
function sync() {
	Alloy.Globals.Spinner.show("Syncing...");
	var stepsProvider = new StepsProvider();
	
	var onComplete = function(message) {
		setTimeout(function() {
			if(message) {
				if(message === "Invalid token.") {
					setTimeout(function() {
						var win = Alloy.createController("auth/login").getView();
						win.open();
					
						win.addEventListener("close", function() {
							sync();
						});
					}, 2000);
				}
				else {
					Ti.UI.createAlertDialog({
						buttonNames: ['OK'],
						message: 'Sync completed with error: ' + message,
						title: 'Done!'	
					}).show();		
				}								
			}
			else {
				Ti.UI.createAlertDialog({
					buttonNames: ['OK'],
					message: 'Sync complete',
					title: 'Done!'	
				}).show();		
				
				$.tblDays.setData([]);
				populateRows();				
			}
			
		}, 1000);
		
		Alloy.Globals.Spinner.hide();					
	};
	
	var onProgress = function(message) {
		Ti.API.info("On progress: " + message);
		Alloy.Globals.Spinner.show(message);	
	};
	
	stepsProvider.sync($.log, {
		onComplete: onComplete,
		onProgress: onProgress
	});	
}

function importSteps() {
	var deferred = q.defer();

	// TODO: We might want to refactor this into a platform-agnostic CommonJS service proxy
	// that calls the appropriate native module.
	var isHealthKitEnabled = Ti.App.Properties.getBool("is-healthkit-enabled");
	if (isHealthKitEnabled) {
		var healthkit = require('ti.healthkit');

		//Alloy.Globals.Spinner.show("Importing from HealthKit...");

		var lastSyncDate = Ti.App.Properties.getString('lastSyncDate', null);
		var from = new Date(lastSyncDate);
		//var from = new Date(0);
		var to = new Date(); // today

		Ti.API.info('Importing steps from: ', from);
		healthkit.querySteps(from, to, function(response) {
			Ti.API.info('healthkit query steps got response!');
			Ti.API.info(response);

			// The most likely reason for a failure here is if the user manually revokes
			// permission to access healthkit
			if (!response.success) {
				Alloy.createWidget("com.mcongrove.toast", null, {
					text: response.message,
					duration: 2000,
					view: $.steps,
					theme: "error"
				});		
				deferred.resolve();
				return;
			}

			response.result = JSON.parse(response.result);
			response.result.forEach(element => {
				var date = new Date(element.eventDate);
				var steps = element.steps;

				var item = Alloy.Globals.Steps.readByDate(date); // find an existing steps record for that date
				if (!item) {
					item = {
						activityPart: 0,
						moderateMins: 0,
						vigorousMins: 0,
						stepsWalked: 0,
						stepsTotal: 0,
						stepsDate: date
					};
				}
				
				// we need to increment both of these fields; stepsWalked so that it's editable in the form,
				// stepsTotal so that it shows up in the list
				item.stepsWalked += steps; 
				item.stepsTotal += steps;

				Ti.API.info('Saving item from HealthKit', item);
				Alloy.Globals.Steps.writeSingle(item);
			});

			Ti.App.Properties.setString('lastSyncDate', to.toISOString());
			deferred.resolve();

			//Alloy.Globals.Spinner.hide();
		});
	}
	else {
		deferred.resolve();
	}

	return deferred.promise;
}

/**
 * @description Calls `addDateRow` for today and yesterday, then calls `loadDatesFrom` from the date before yesterday.
 * @memberof Controllers.Steps
 */
function populateRows() {	
	var today = new Date();
	Ti.API.info("Today: ", today);
	
	addDateRow("Today", today);
	
	var yesterday = DateTimeHelper.getDayBefore(today);
	addDateRow("Yesterday", yesterday);
	
	loadDatesFrom(DateTimeHelper.getDayBefore(yesterday));
}

/**
 * @description Event handler for the Window's `open` event. Calls 'populateRows'.
 * @memberof Controllers.Steps
 */
function window_open() {	
	Alloy.Globals.tracker.addScreenView('Steps');	
	
	if(Ti.Platform.osname !== "android") {
		setiOSNavButtons();
	}
	
	//Alloy.Globals.Spinner.show("Loading steps...");

	importSteps()
		.then(function() {
			populateRows(); // populate the rows AFTER importing
		});
}

function setiOSNavButtons() {
	$.window.leftNavButton = NavBarButton.createLeftNavButton({
		text: "Home",
		onClick: btnBack_click
	});
	
	$.window.rightNavButton = NavBarButton.createRightNavButton({
		text: "Sync",
		onClick: btnSync_click
	});
}

//Use this approach to expose a means of adding menu items to the Activity Bar to the calling code.
//The caller will say win.addAndroidMenuItems(); before calling win.open();
function setAndroidMenuItems() {
	var activity = $.log.activity;
	
	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var menuItem = menu.add({
	    title: "Sync",
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	  
	  menuItem.addEventListener("click", btnSync_click);
	};
}
$.log.setAndroidMenuItems = setAndroidMenuItems;

/**
 * @description Event handler for `tblRow`. If e is a 'Load More' button, it gets deleted and another month of dates are loaded. Otherwise, the form controller is shown.
 * @listens click
 * @param {Object} e The event source
 * @memberof Controllers.Steps
 */
function tblRow_click(e) {
	Ti.API.info("Row clicked.", e);
	
	//Due to the child view in the TableViewRow, e.source doesn't
	//contain custom properties. Using e.row instead.
	if(e.row.isLoadMoreButton) {
		$.tblDays.deleteRow(e.row);
		loadDatesFrom(e.row.date);
	}
	else {
		var entryWin = Alloy.createController('steps/form', {
			title: e.row.label,
			date:  e.row.date,
			obj: e.row,
			callback: function(stepsLogged) {
				if(stepsLogged > 0) {
					addDateRow(e.row.label, e.row.date, false, e.index);
					
					Ti.API.info("Deleting row:", e.row);
					$.tblDays.deleteRow(e.index);	//Note: on iOS, it was observed that this line would randomly cause a crash when passing the Ti.UI.TableViewRow.
													//pass an index instead.	
				}
			}
		}).getView();
		
		if(Ti.Platform.osname === "android") {
			entryWin.setAndroidMenuItems();
		}
		
		entryWin.open();
	}
}

/**
 * @description Event handler for `btnBack`. Closes the window.
 * @memberof Controllers.Steps
 */
function btnBack_click() {
	$.log.close();
}

/**
 * @description Event handler for `btnSync`. Calls `sync`.
 * @memberof Controllers.Steps
 */
function btnSync_click() {
	sync();
}
