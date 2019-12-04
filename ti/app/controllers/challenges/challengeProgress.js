var challenge = $.args.challenge;

var ChallengesProvider = require('classes/ChallengesProvider');
var DateTimeHelper = require('helpers/DateTimeHelper');
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
            Ti.API.info('Current challenge', JSON.stringify(challenge));
            Ti.API.info('Got progress', JSON.stringify(result));

            var today = DateTimeHelper.localise(new Date());
            var startDate = DateTimeHelper.localise(new Date(challenge.challenge.start_date));
            var endDate = DateTimeHelper.localise(new Date(challenge.challenge.end_date));

            $.challengeProgressView.lblGoalSteps.text = 
                FormatHelper.formatNumber(result.steps_goal);

            $.challengeProgressView.lblProgressSteps.text = 
                FormatHelper.formatNumber(result.steps_total);

            $.challengeProgressView.lblStartDate.text = 
                DateTimeHelper.getDateLabel(startDate, true);

            $.challengeProgressView.lblEndDate.text = 
                DateTimeHelper.getDateLabel(endDate, true);

            // Calculate day diff between today and result.end_date.
            
            var timeLeft = DateTimeHelper.getTimeBetween(endDate, today, false); // don't show hours
            $.challengeProgressView.lblTimeLeft.text = timeLeft;

            // Remaining steps
            var remainingSteps = result.steps_goal - result.steps_total;
            Ti.API.info('Remaining steps: ' + remainingSteps);

            $.challengeProgressView.lblRemainingSteps.text = 
                FormatHelper.formatNumber(remainingSteps);

            // Required steps / day
            var remainingDays = DateTimeHelper.getDaysBetween(endDate, today);
            Ti.API.info('Remaining days: ' + remainingDays);

            var stepsPerDay = remainingDays > 0 ?
                Math.round(remainingSteps / remainingDays) :
                0;

            Ti.API.info('Steps per day: ' + stepsPerDay);
            $.challengeProgressView.lblRequiredDailySteps.text = 
                FormatHelper.formatNumber(stepsPerDay);

            // % complete
            var percentComplete = result.steps_total / result.steps_goal;
            $.challengeProgressView.lblPercentComplete.text = Math.round(percentComplete * 100) + '%';

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
    //$.window.title = challenge.name;
    $.challengeProgressView.title.text = challenge.name;

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