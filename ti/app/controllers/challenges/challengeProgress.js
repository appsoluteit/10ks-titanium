var challenge = $.args.challenge;

var ChallengesProvider = require('classes/ChallengesProvider');
var SessionHelper = require('helpers/SessionHelper');

function btnBack_click() {
    $.challengeProgress.close();
}

function window_open() {
    $.window.title = challenge.name;

    Alloy.Globals.tracker.addScreenView('Challenge Progress');
}