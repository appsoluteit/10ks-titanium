/**
 * Config options:
 * 
 * view - the view to add the widget to
 * taskName - the title
 * taskDescription - a longer description. This will be truncated to 50 characters.
 * stepsWalked - (integer) how many steps have been walked
 * percentComplete - (integer) the percentage complete so far
 */

var CONFIG = arguments[0] || {};

$.taskName.text = CONFIG.taskName;
$.stepsWalked.text = CONFIG.stepsWalked + " Steps";
$.percentComplete.text = CONFIG.percentComplete + "%";

//$.taskDescription.text = CONFIG.taskDescription.substring(0, 50);	

CONFIG.view.add($.view);