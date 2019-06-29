var challenge = $.args.challenge;

var ChallengesProvider = require('classes/ChallengesProvider');
var FormatHelper = require('helpers/FormatHelper');
var SessionHelper = require('helpers/SessionHelper');

function btnBack_click() {
    $.challengeProgress.close();
}

function showLogin() {
	var win = Alloy.createController("auth/login").getView();
	win.open();
	
	win.addEventListener("close", function() {
		fetchProgress();
	});
}

function fetchProgress() {
    new ChallengesProvider()
        .getProgress()
        .then(function(result) {
            Ti.API.info('Got progress', result);
            $.challengeProgressView.lblGoalSteps.text = 
                FormatHelper.formatNumber(result.steps_goal);

            $.challengeProgressView.lblProgressSteps.text = 
                FormatHelper.formatNumber(result.steps_total);

            var diff = result.steps_goal - result.steps_total;
            Ti.API.info('Remaining steps: ' + diff);

            $.challengeProgressView.lblRemainingSteps.text = 
                FormatHelper.formatNumber(diff);

            $.challengeProgressView.vbar1.init(
                result.steps_total, 
                result.steps_goal
            );
        })
        .catch(function(reason) {
            Ti.API.error('Challenge progress error', reason);

            if(SessionHelper.isTokenInvalid(reason)) {
                SessionHelper.showInvalidTokenToast($.challengeProgress);
                
                setTimeout(function() {
                    showLogin();
                }, 2000);
            }
            else {
                Alloy.createWidget("com.mcongrove.toast", null, {
                    text: "Couldn't load challenge progress",
                    duration: 2000,
                    view: $.challengeProgress,
                    theme: "error"
                });	
            }	
        });
}

function window_open() {
    $.window.title = challenge.name;

    Alloy.Globals.tracker.addScreenView('Challenge Progress');
    $.challengeProgressView.btnChallengeDetails.addEventListener('click', function() {
        var win = Alloy.createController('challenges/challengeDetails', {
            challenge: challenge
        })
        .getView();

        win.open();
    });

    fetchProgress();
}